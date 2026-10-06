import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://yvralrlmgjxsoxzumcrc.supabase.co', 'sb_publishable_VuIsDw8aGfdnbKqWjuCT5Q_-lG-iJqY')

document.forms["sign-up-form"].addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email);
    console.log(password);
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    })
});
