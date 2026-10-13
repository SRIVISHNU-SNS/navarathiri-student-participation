import { z } from "zod";

export const participationValues = [
  "Group Dance",
  "Solo Dance",
  "Classical Dance",
  "Singing / Vocal Performance",
  "Music / Instrumental Performance",
  "Drama / Skit",
  "Traditional Dress / Fashion Walk",
  "Anchoring / Hosting",
  "Rangoli / Creative Activities",
  "Decoration / Event Volunteers",
  "Other",
] as const;

export const rehearsalValues = ["Yes", "No", "Depends on schedule"] as const;

const optionalText = (maxLength: number) =>
  z.string().trim().max(maxLength).optional().default("");

export const registrationSchema = z
  .object({
    fullName: z.string().trim().min(1, "Enter your full name.").max(120),
    department: z.string().trim().min(1, "Enter your department or course.").max(180),
    participation: z.enum(participationValues),
    participantType: z.enum(["Individual", "Group"]),
    groupName: optionalText(160),
    groupSize: optionalText(32),
    groupMembers: optionalText(1500),
    rehearsal: z.enum(rehearsalValues),
    query: z.string().trim().min(1, "Enter your query, or type ‘No’ if you have none.").max(2000),
  })
  .transform((values) => ({
    ...values,
    ...(values.participantType === "Individual"
      ? { groupName: "", groupSize: "", groupMembers: "" }
      : {}),
  }));

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationRecordInput = z.output<typeof registrationSchema>;
