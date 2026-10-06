import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://yvralrlmgjxsoxzumcrc.supabase.co', 'sb_publishable_VuIsDw8aGfdnbKqWjuCT5Q_-lG-iJqY')

let button = document.getElementById("sign-up");
button.addEventListener("click", async function(event){
    console.log("done");
    const { data, error } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
    })
});
