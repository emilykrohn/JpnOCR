
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

const res = await fetch("./jmdict-eng-common-3.6.2.json");
const json = await res.json();
const index = new Map();
json.words.forEach((word, i) => {
    // Create array of readings for word that will look like ["食べる", "たべる"]
    const readings = [
        ...word.kanji.map(k => k.text),
        ...word.kana.map(k => k.text),
    ];

    for (const reading of readings) {
        // if reading isn't in index than add new reading to index
        if (!index.has(reading)) {
            index.set(reading, []);
        }
        // push index to the value of the key for reading ex: "はし": [1, 15, 32]
        index.get(reading).push(i);
    }
});

let current_word = "";

document.addEventListener('mousemove', e => {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (element.nodeName && element.nodeName.toLowerCase() === 'span' && element.innerHTML !== current_word) {
        current_word = element.innerHTML;
        displayDefinition();
    }
})

function lookup(term) {
    const wordIndices = index.get(term) || [];
    return wordIndices.map(i => json.words[i]);
}

function getGlosses(term) {
    return lookup(term).flatMap(word =>
        word.sense.flatMap(s => s.gloss.map(g => g.text))
    );
}

function displayDefinition() {
    document.getElementById('definition').innerHTML = getGlosses(current_word);
}