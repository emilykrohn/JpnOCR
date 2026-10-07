import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://yvralrlmgjxsoxzumcrc.supabase.co', 'sb_publishable_VuIsDw8aGfdnbKqWjuCT5Q_-lG-iJqY')

document.forms["sign-up-form"]?.addEventListener("submit", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
});

document.forms["login-form"]?.addEventListener("submit", async (e) => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        console.log(error);
    }
});