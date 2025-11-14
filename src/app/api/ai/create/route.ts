import { generateObject } from 'ai';
import { NextRequest } from 'next/server';
import { CreateTaskWithAISchema } from '@/lib/create-task-with-ai-schema';
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRole) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY in environment');
}
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  serviceRole,
);


export async function POST(req: NextRequest) {
  const { prompt, userId, sort_order, list_id, board_id, workspace_id} = await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: 'Prompt required' }, { status: 400 });
  }
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  //generate the task
  const { object:newTask } = await generateObject({
    model: "openai/gpt-4o-mini", // cheap & fast
    schema: CreateTaskWithAISchema,
    prompt: `Extract a single task from the user request. Return ONLY the JSON fields defined by the schema.\n\nUser: ${prompt}`,
  });

  console.log('AI result:', newTask);

  //insert into supabase
  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert({...newTask, sort_order, list_id, board_id, workspace_id })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ task: data });
}