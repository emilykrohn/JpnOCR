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
    console.log(cardInfo);
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