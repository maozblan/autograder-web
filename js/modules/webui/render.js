import * as Util from './util.js'

function makeCardObject(type = 'unknown', text = '', link = '#') {
    return {
        type: type,
        text: text,
        link: link,
    };
}

function card(card = {type: 'unknown', text: '', link: '#'}) {
    return `
        <div class='card card-${card.type}'>
            <a href='${card.link}' alt='${card.text}'>
                <p>${card.text}</p>
            </a>
        </div>
    `;
}

// Render some cards to html.
// This function takes ownership of the list of cards.
function cards(cards) {
    cards.sort(function(a, b) {
        return Util.caseInsensitiveStringCompare(a.text, b.text);
    });

    let html = [];
    for (const item of cards) {
        html.push(card(item));
    }

    return `
        <div class='cards-area'>
            ${html.join("\n")}
        </div>
    `;
}

export {
    card,
    cards,
    makeCardObject,
}
