import { z } from "zod";



const updatedDataSchema = z.object({
  problemDesc: z.string().optional(),
  option: z.string().optional(),
  questionImagePath: z.string().optional(),
  answer: z.string().optional(),
  explanation: z.string().optional(),
  explanationImagePath: z.string().optional(),
  linkPath: z.string().optional(),
});

// Define the schema for the data to send (including tryoutId, subtest, and questionNumber)
const dataSchema = z.object({
  tryoutId: z.number().positive(),
  subtest: z.string().min(1),
  questionNumber: z.number().int().positive(),
  updatedData: updatedDataSchema,
});

export { dataSchema };
