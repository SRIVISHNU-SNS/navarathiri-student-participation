import { describe, expect, it } from "vitest";
import { participationValues, registrationSchema, rehearsalValues } from "./registration-schema";

const validResponse = {
  fullName: "  Asha K  ",
  department: "Computer Science",
  participation: "Group Dance",
  participantType: "Individual",
  rehearsal: "Yes",
  query: "No",
};

describe("registration schema", () => {
  it("accepts a complete registration and normalizes text", () => {
    const result = registrationSchema.parse(validResponse);
    expect(result.fullName).toBe("Asha K");
    expect(result.groupName).toBe("");
    expect(result.groupSize).toBe("");
    expect(result.groupMembers).toBe("");
  });

  it("preserves optional group details only for a group", () => {
    const result = registrationSchema.parse({
      ...validResponse,
      participantType: "Group",
      groupName: "Nritya",
      groupSize: "12",
      groupMembers: "A, B, C",
    });
    expect(result).toMatchObject({ groupName: "Nritya", groupSize: "12", groupMembers: "A, B, C" });
  });

  it("accepts exactly the specified activity and rehearsal choices", () => {
    expect(participationValues).toHaveLength(11);
    expect(rehearsalValues).toEqual(["Yes", "No", "Depends on schedule"]);
    expect(registrationSchema.safeParse({ ...validResponse, participation: "Something else" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...validResponse, rehearsal: "Maybe" }).success).toBe(false);
  });

  it("requires the query answer and the other required fields", () => {
    expect(registrationSchema.safeParse({ ...validResponse, query: "   " }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...validResponse, department: "" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...validResponse, participantType: "" }).success).toBe(false);
  });
});
