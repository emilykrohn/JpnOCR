document.forms["upload-form"].addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = document.getElementById("uploaded-image").files[0];
    if (!file) return;
    const img = document.getElementById("card-img");
    img.src = URL.createObjectURL(file);

    const { data: { text } } = await Tesseract.recognize(file, "jpn");
    const cleanText = text.replace(/\s+/g, "");
    //document.getElementById("card-text").innerText = cleanText;
    kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" }).build(function (err, tokenizer) {
        if (err) {
            console.error(err);
            return;
        }
        var path = tokenizer.tokenize(cleanText);
        console.log(path);
        
        for (const word of path) {
            const newWord = document.createElement('span');
            const pos = Object.entries(word)[4][1];
            const text = Object.entries(word)[10][1];
            newWord.textContent = text;
            newWord.classList.add('card-word');
            if (pos === "名詞") {
                newWord.classList.add('red-text');
            } else if (pos === "助詞") {
                newWord.classList.add('blue-text');
            } else if (pos === "動詞") {
                newWord.classList.add("orange-text");
            } else if (pos === "助動詞") {
                newWord.classList.add("green-text");
            } else if (pos === "副詞") {
                newWord.classList.add("purple-text");
            }
            document.getElementById("card-text").appendChild(newWord);
        }
    });
});
