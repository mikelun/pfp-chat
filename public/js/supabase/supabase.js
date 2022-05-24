var supabase;
import { createClient } from "@supabase/supabase-js";

// SUPABASE FOR CLIENT

export function initializeSupabase() {
    // Create a single supabase client for interacting with your database
    supabase = createClient('https://avsqstqowmmaojuhjogu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2c3FzdHFvd21tYW9qdWhqb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0OTUxMzcsImV4cCI6MTk2ODA3MTEzN30.FeuBSjGpORYyH8ASsmH26nnc3dnrnHvrtSbQ2RDjLrA');
}

export function getSupabaseUser() {
    var user = supabase.auth.user();
    return user;

}

export async function signInWithGoogle() {
        
    var user = supabase.auth.user();
    if (!user) {
        const { user, session, error } = await supabase.auth.signIn({
            provider: 'google',
        });
    }
    return user;
}