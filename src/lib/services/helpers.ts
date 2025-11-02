// src/lib/helpers.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { get } from 'http'

export const callEdgeFunction = async <T = any>(
  supabase: SupabaseClient,
  fn: string,
  body: any,
): Promise<T> => {
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  if (!session?.access_token || !user?.id) {
    throw new Error('Not authenticated')
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/${fn}`

  console.log('Calling Edge Function:', fn, body) // DEBUG

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      'x-user-id': user.id,
    },
    body: JSON.stringify(body),
    
  })

  const text = await res.text()
  console.log('Edge Response:', res.status, text) // DEBUG

  if (!res.ok) {
    throw new Error(text || `Edge Function ${fn} failed`)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error('Invalid JSON response')
  }
}