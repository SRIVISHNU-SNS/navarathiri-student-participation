import { createServer, type Server } from "node:http";
import type { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createRegistrationApp } from "./app";

type MemoryRow = {
  id: string;
  fullName: string;
  department: string;
  participation: string;
  participantType: "Individual" | "Group";
  groupName: string;
  groupSize: string;
  groupMembers: string;
  rehearsal: string;
  query: string;
  createdAt: Date;
};

class MemoryPool {
  rows: MemoryRow[] = [];
  nextId = 1;

  reset() {
    this.rows = [];
    this.nextId = 1;
  }

  async query(sql: string, values: unknown[] = []): Promise<{ rows: unknown[]; rowCount: number }> {
    if (sql.includes("INSERT INTO registrations")) {
      const [fullName, department, participation, participantType, groupName, groupSize, groupMembers, rehearsal, query] =
        values as string[];
      const id = String(this.nextId++);
      this.rows.unshift({
        id,
        fullName,
        department,
        participation,
        participantType: participantType as MemoryRow["participantType"],
        groupName,
        groupSize,
        groupMembers,
        rehearsal,
        query,
        createdAt: new Date(),
      });
      return { rows: [{ id }], rowCount: 1 };
    }
    if (sql.includes("FROM registrations")) {
      return { rows: this.rows, rowCount: this.rows.length };
    }
    throw new Error("Unexpected query in the in-memory API test.");
  }
}

const memoryPool = new MemoryPool();
let server: Server;
let baseUrl = "";
const testCode = "123456";

describe("registration API", () => {
  beforeAll(async () => {
    const app = createRegistrationApp({
      pool: memoryPool as unknown as Pool,
      adminPin: testCode,
      sessionSecret: "integration-test-session-secret-that-is-not-a-real-secret",
    });
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Test server did not start.");
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(() => memoryPool.reset());

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("accepts 50 entries, keeps them private, and unlocks listing and CSV only after login", async () => {
    const registration = (number: number) => ({
      fullName: `Student ${number}`,
      department: "Computer Science",
      participation: "Group Dance",
      participantType: "Individual",
      groupName: "Stale value is cleared for individuals",
      groupSize: "12",
      groupMembers: "Stale value is cleared for individuals",
      rehearsal: "Yes",
      query: "No",
    });

    for (let number = 1; number <= 50; number += 1) {
      const response = await fetch(`${baseUrl}/api/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration(number)),
      });
      expect(response.status).toBe(201);
    }

    const unauthenticated = await fetch(`${baseUrl}/api/admin/registrations`);
    expect(unauthenticated.status).toBe(401);
    expect((await unauthenticated.json()).entries).toBeUndefined();

    const wrongCode = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "654321" }),
    });
    expect(wrongCode.status).toBe(401);

    const login = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: testCode }),
    });
    expect(login.status).toBe(200);
    const cookie = login.headers.get("set-cookie")?.split(";")[0];
    expect(cookie).toMatch(/^navarathiri_admin=/);

    const access = { headers: { cookie: cookie as string } };
    const listResponse = await fetch(`${baseUrl}/api/admin/registrations`, access);
    expect(listResponse.headers.get("cache-control")).toContain("no-store");
    const list = await listResponse.json();
    expect(list.count).toBe(50);
    expect(list.entries).toHaveLength(50);
    expect(list.entries[0]).toMatchObject({
      fullName: "Student 50",
      groupName: "",
      groupSize: "",
      groupMembers: "",
    });

    const csvResponse = await fetch(`${baseUrl}/api/admin/export.csv`, access);
    const csv = await csvResponse.text();
    expect(csvResponse.headers.get("content-type")).toContain("text/csv");
    expect(csv).toContain('"Full name"');
    expect(csv).toContain('"Student 1"');
  });

  it("rejects invalid data without adding a row", async () => {
    const response = await fetch(`${baseUrl}/api/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "", query: "" }),
    });
    expect(response.status).toBe(400);
    expect(memoryPool.rows).toHaveLength(0);
  });
});
