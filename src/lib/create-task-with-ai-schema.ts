

// lib/task-schema.ts
import { z } from 'zod';

export const CreateTaskWithAISchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .describe(
      'A short, imperative title for the task. ' +
      'Must be a single sentence, start with a verb, e.g. "Design login page".'
    ),

  description: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Optional longer description of the task. ' +
      'If the user does not provide any extra detail, return null.'
    ),

  due_date: z
    .string()
    .nullable()
    .optional()
    .describe(
      `The date of the task. Today's date is ${new Date().toISOString().split('T')[0]}. Use YYYY-MM-DD format. if the user does not specify a date, assume today.`
    ),

  priority: z
    .enum(['low', 'medium', 'high'])
    .describe(
      'Task priority. ' +
      'Use "high" only when the user explicitly says “urgent”, “high”, or similar. ' +
      'Otherwise default to "medium".'
    ),

  assignee: z
    .string()
    .nullable()
    .optional()
    .describe(
      'This is the name of the person to whom the task is assigned. ' +
      'If the user does not specify anyone, return null.'
    ),
});

export type CreateTaskWithAIType = z.infer<typeof CreateTaskWithAISchema>;