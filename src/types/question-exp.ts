import { z } from "zod";

const updatedDataSchema = z.object({
  problemDesc: z.string().nullable().optional(),
  option: z.string().nullable().optional(),
  questionImagePath: z.string().nullable().optional(),
  answer: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
  explanationImagePath: z.string().nullable().optional(),
  linkPath: z.string().nullable().optional(),
});

const dataSchema = z.object({
  tryoutId: z.number().positive(),
  subtest: z.string().min(1),
  questionNumber: z.number().int().positive(),
  updatedData: updatedDataSchema,
});

export { dataSchema, updatedDataSchema };

