document.forms["upload-form"].addEventListener("submit", (e) => {
    e.preventDefault();
    const file = document.getElementById("uploaded-image").files[0];
    if (!file) return;
    const img = document.getElementById("card-img");
    img.src = URL.createObjectURL(file);
});