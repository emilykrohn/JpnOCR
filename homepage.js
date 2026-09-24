document.forms["upload-form"].addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("uploaded-image").files[0];
    if (!file) return;
    const img = document.getElementById("card-img");
    img.src = URL.createObjectURL(file);

    const { data: { text } } = await Tesseract.recognize(file, "jpn");
    const cleanText = text.replace(/\s+/g, "");
    document.getElementById("card-text").innerText = cleanText;
    kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" }).build(function (err, tokenizer) {
        if (err) {
            console.error(err);
            return;
        }
        var path = tokenizer.tokenize(cleanText);
        console.log(path);
    });
});