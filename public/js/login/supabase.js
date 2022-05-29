var supabase;
import { createClient } from "@supabase/supabase-js";

// SUPABASE FOR CLIENT

export function initializeSupabase() {

    window.twttr = (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function (f) {
            console.log(f);
            t._e.push(f);
        };

        return t;
    }(document, "script", "twitter-wjs"));

    // twttr.events.bind(
    //     'click',
    //     function (ev) {
    //       console.log(ev);
    //     }
    //   );

    return;
    // Create a single supabase client for interacting with your database
    supabase = createClient('https://avsqstqowmmaojuhjogu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2c3FzdHFvd21tYW9qdWhqb2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTI0OTUxMzcsImV4cCI6MTk2ODA3MTEzN30.FeuBSjGpORYyH8ASsmH26nnc3dnrnHvrtSbQ2RDjLrA');
    connectTwitter();
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

export async function connectTwitter() {
    var user = supabase.auth.user();
    console.log(user);
    if (!user) {
        const { user, session, error } = await supabase.auth.signIn({
            provider: 'twitter',
        });
    }
    //return user;
}