// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hwfskhaabdsbcynseuxi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3ZnNraGFhYmRzYmN5bnNldXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMTQwNjgsImV4cCI6MjA2NTY5MDA2OH0.Q9lFfzoVzmEECxio_Fp2iJHpOObnRB5nu-37WVHegAM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)