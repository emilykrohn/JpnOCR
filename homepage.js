import { createRoot } from "react-dom/client";

function Navbar() {
    return (
        <div id="navbar">
            <div class="contents">
                <p class="navbar-text">JpnOCR</p>
                <div class="account-buttons">
                    <a href="login.html">
                        <button id="login-navbar">Login</button>
                    </a>
                    <a href="sign-up.html">
                        <button id="sign-up-navbar">Sign Up</button>
                    </a>
                </div>
            </div>
        </div>
    );
}

function OCR() {
    return (
        <>
            <p id="example-text">Upload an image from your computer that has Japanese text. It will be turned into text and you will can see the definitions for each word when you hover your mouse over it.</p>
            <img src="example.png" id="example-img" alt="Example of an image the user can upload" width="1000" height="400" />
            <div id="image-buttons">
                <form name="upload-form" onSubmit={handleFormSubmit}>
                    <div>
                        <label id="image-label" for="file">Choose a file to upload</label>
                        <input type="file" id="uploaded-image" name="uploaded-image" accept="image/png, image/jpeg" />
                        <input class="button" type="submit" value="Upload Image" />
                    </div>
                </form>
                <button>Save</button>
            </div>
            <div id="card">
                <div id="content">
                    <img src="upload-image.png" id="card-img" alt="Sample image" width="600" height="350" />
                    <div id="card-text"></div>
                </div>
            </div>
            <div id="card">
                <div id="content">
                    <div id="definition-title">
                        <p id="card-word">Word</p>
                        <p id="card-pos">Part of Speech</p>
                    </div>
                    <p id="definition"></p>
                </div>
            </div>
        </>
    );
}

function Anki() {
    return (
        <>
            <button id="connect-to-anki">Connect to Anki</button>
            <div id="card">
                <div id="content">
                    <div id="definition-title">
                        <p id="total-kanji">Total Number of Unique Kanji</p>
                        <p id="anki-status">Not Connected to Anki</p>
                    </div>
                </div>
            </div>
        </>
    );
}

function Footer() {
    return (
        <div id="navbar">
            <div class="contents">
                <p class="navbar-text">JpnOCR</p>
            </div>
        </div>
    );
}
function App() {
    return (
        <>
            <Navbar />
            <div id="homepage-container">
                <OCR />
                <Anki />
            </div>
            <Footer />
        </>
    );
}

createRoot(document.getElementById("root")).render(
    <App />
);

var path = "";

async function handleFormSubmit(e) {
    e.preventDefault();
    const cardText = document.getElementById("card-text");
    cardText.replaceChildren();
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
        path = tokenizer.tokenize(cleanText);
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
};

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
    if (element && element.nodeName.toLowerCase() === 'span' && element.innerHTML !== current_word) {
        current_word = element.innerHTML;
        for (const word of path) {
            if (Object.entries(word)[10][1] === current_word) {
                const pos = Object.entries(word)[4][1];
                document.getElementById("card-word").textContent = current_word;
                document.getElementById("card-pos").textContent = pos;
            }
        }
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