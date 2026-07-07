import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }

  return supabaseClient;
}

async function readRemoteState(): Promise<Record<string, unknown>> {
  const client = getSupabaseClient();
  if (!client) {
    return {};
  }

  try {
    const { data, error } = await client
      .from('app_state')
      .select('data')
      .eq('id', 'app')
      .maybeSingle();

    if (error || !data?.data) {
      return {};
    }

    return data.data as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function writeRemoteState(payload: Record<string, unknown>) {
  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  try {
    await client.from('app_state').upsert({ id: 'app', data: payload });
  } catch {
    // Ignore remote sync failures and keep using local storage
  }
}

export async function loadPersistedState<T>(key: string, fallback: T): Promise<T> {
  const remotePayload = await readRemoteState();
  const remoteValue = remotePayload[key];
  if (remoteValue !== undefined) {
    return remoteValue as T;
  }

  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved) as T;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function savePersistedState<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));

  const client = getSupabaseClient();
  if (!client) {
    return;
  }

  try {
    const remotePayload = await readRemoteState();
    remotePayload[key] = value;
    await writeRemoteState(remotePayload);
  } catch {
    // Ignore remote sync failures and keep using local storage
  }
}
