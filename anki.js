function invoke(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });

        xhr.open('POST', 'http://127.0.0.1:8765');
        xhr.send(JSON.stringify({action, version, params}));
    });
}

async function main() {
    console.log("Connected to Anki...");
    const result = await invoke('findCards', 6, {query: 'deck:current'});
    const result2 = await invoke('cardsInfo', 6, {cards: result, noteFields: ["Definitions", "Target Word"]});
    const cardInfo = result2.map(c => ({
        cardId: c.cardId,
        word: c.fields["Target Word"].value,
        definition: c.fields["Definitions"].value,
    }));
    notKanji = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ",
        "わ", "を", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        ".", ",", "!", "?", ":", ";", "'", "\"", "(", ")", "[", "]", "{", "}", "-", "_", "+", "=", "/", "\\", "|", "<", ">", "@", "#", "$", "%", "^", "&", "*", "~", "`",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    ];
    for (const char of cardInfo[0]["word"]) {
        if (!notKanji.includes(char)) {
            console.log(char);
        }
    }
    console.log(cardInfo[0]["word"]);
    return cardInfo;
}
document.getElementById("connect-to-anki").addEventListener("click", async () => {
    const status = document.getElementById("anki-status");
    status.textContent = "Connecting to Anki…";
    try {
        await main();
        status.textContent = "Connected to Anki";
    } catch (err) {
        status.textContent = "Not connected to Anki";
        console.error("Failed to connect to Anki:", err);
    }
});