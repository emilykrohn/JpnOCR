// import { createClient } from '@supabase/supabase-js'

// const supabase = createClient('https://yvralrlmgjxsoxzumcrc.supabase.co', 'sb_publishable_VuIsDw8aGfdnbKqWjuCT5Q_-lG-iJqY')

document.forms["sign-up-form"].addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(name);
    console.log(email);
    console.log(password);
});

// let button = document.getElementById("signUp");
// button.addEventListener("click", async function(event){
//     console.log("done");
//     const { data, error } = await supabase.auth.signUp({
//     email: 'example@email.com',
//     password: 'example-password',
//     })
// });
