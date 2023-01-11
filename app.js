function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

let pairs = ["maria", "maria", "jose", "jose", "jesus", "jesus", "melchor", "melchor", "gaspar", "gaspar", "baltazar", "baltazar", "pastor", "pastor", "mula", "mula"];
shuffle(pairs);

const game = document.getElementById("game");
let templateCard = document.getElementById("template-card").content;
let state = [0, null];

function createCards(game){
    let clone;
    for (let i=0; i<16; i++){
        clone = templateCard.cloneNode(true);
        clone.querySelector(".card-back").classList.add(pairs[i]);
        game.appendChild(clone);
    }
}

const flipCard = card => card.parentNode.classList.toggle('is-flipped');

function checkState(state, target){
    switch (state[0]){
        case 1:
            state[1] = target;
            break;
        case 2:
            setTimeout(() => {
                if (state[1].classList[2] == target.classList[2]){
                    state[0] = 0;
                    return;
                }
                flipCard(state[1]);
                flipCard(target);
                state[0] = 0;
            }, 1000)
            break;
    }
}

game.addEventListener('click', event =>{
    const target = event.target;
    const card = target.parentNode.children[1];

    if (state[1] != null && state[0] == 2) return;
    if (!(target.classList.contains('card-face'))) return;
    if ((target.parentNode.classList.contains('is-flipped'))) return;
    
    flipCard(target);
    state[0]++;
    checkState(state, card);
    event.stopPropagation();
});

createCards(game);
