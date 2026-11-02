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
    notKanji = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
        "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        ".", ",", "!", "?", ":", ";", "'", "\"", "(", ")", "[", "]", "{", "}", "-", "_", "+", "=", "/", "\\", "|", "<", ">", "@", "#", "$", "%", "^", "&", "*", "~", "`",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ", "が", "ぎ", "ぐ", "げ", "ご",
        "さ", "し", "す", "せ", "そ", "ざ", "じ", "ず", "ぜ", "ぞ",
        "た", "ち", "つ", "て", "と", "だ", "ぢ", "づ", "で", "ど",
        "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ", "ば", "び", "ぶ", "べ", "ぼ", "ぱ", "ぴ", "ぷ", "ぺ", "ぽ",
        "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "ら", "り", "る", "れ", "ろ",
        "わ", "を", "ん", "っ", "ゃ", "ゅ", "ょ",
        "ア", "イ", "ウ", "エ", "オ",
        "カ", "キ", "ク", "ケ", "コ", "ガ", "ギ", "グ", "ゲ", "ゴ",
        "サ", "シ", "ス", "セ", "ソ", "ザ", "ジ", "ズ", "ゼ", "ゾ",
        "タ", "チ", "ツ", "テ", "ト", "ダ", "ヂ", "ヅ", "デ", "ド",
        "ナ", "ニ", "ヌ", "ネ", "ノ",
        "ハ", "ヒ", "フ", "ヘ", "ホ", "バ", "ビ", "ブ", "ベ", "ボ", "パ", "ピ", "プ", "ペ", "ポ",
        "マ", "ミ", "ム", "メ", "モ",
        "ヤ", "ユ", "ヨ",
        "ラ", "リ", "ル", "レ", "ロ",
        "ワ", "ヲ", "ン", "ッ", "ャ", "ュ", "ョ"
    ];
    for (const card of cardInfo) {
        for (const char of card["word"]) {
            if (!notKanji.includes(char)) {
                console.log(char);
            }
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