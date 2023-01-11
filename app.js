//Start at the top
window.scrollTo(0, 0);


//Shuffle an array's content
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

//Array containing all possible cards
let pairs = ["maria", "maria", "jose", "jose", "jesus", "jesus", "melchor", "melchor", "gaspar", "gaspar", "baltazar", "baltazar", "pastor", "pastor", "mula", "mula"];
shuffle(pairs);

//Creating game objects and state variables
const startBtn = document.getElementById("btn-comenzar");
const gameBtn = document.getElementById("btn-juego");
const gameModal = document.getElementById("modal-juego");
const textModal = document.getElementById("texto");
const game = document.getElementById("game");
let counter = 0;
let beat = new Audio('');
let templateCard = document.getElementById("template-card").content;
let state = [0, null];

//Spawns 16 cards with their respective class
function createCards(game){
    let clone;
    for (let i=0; i<16; i++){
        clone = templateCard.cloneNode(true);
        clone.querySelector(".card-back").classList.add(pairs[i]);
        game.appendChild(clone);
    }
}

//Flips the card (animation)
const flipCard = card => card.parentNode.classList.toggle('is-flipped');

//Game functionality
function checkState(state, target){
    switch (state[0]){
        case 1:
            playAudio('incorrecta');
            state[1] = target;
            break;
        case 2:
            setTimeout(() => {
                if (state[1].classList[2] == target.classList[2]){
                    counter++;
                    playAudio('correcta');
                    state[0] = 0;
                    if (counter == 8){
                        winnerModal(state[1].classList[2]);
                    } else{
                        setTimeout(()=>playAudio(state[1].classList[2]), 300)
                        updateModal(state[1].classList[2]);
                    }
                    return;
                }
                playAudio('incorrecta');
                flipCard(state[1]);
                flipCard(target);
                state[0] = 0;
            }, 800)
            break;
    }
}

//Modal funcitonality
function updateModal(objectClass){
    window.scrollTo(0, 0);
    gameModal.classList.toggle("hide-modal");
    document.querySelector('body').classList.toggle('no-scroll');
    document.querySelector('.modal-'+ objectClass).classList.toggle('show-item');
    textModal.innerText = setModalText(objectClass);
    setTimeout(() => {
        document.querySelector('.modal-' + objectClass).classList.toggle('show-item');
        document.querySelector('.modal-' + objectClass).classList.toggle('hide-modal');
    }, 3000);
}

//Winner modal
function winnerModal(objectClass){
    window.scrollTo(0, 0);
    playAudio('final');
    document.querySelector('.modal-'+ objectClass).classList.toggle('show-item');
    gameModal.classList.toggle("hide-modal");
    document.querySelector('body').classList.toggle('no-scroll');
    document.querySelector('.modal-titulo').innerText = 'Armaste tu pesebre';
    textModal = 'Y junto con la esperanza de la llegada del Niño Dios te deseamos de todo corazón que ese regalo que tanto has anhelado llegue a ti en esta navidad.';
    gameBtn.innerText = 'Volver a intentar';
}

//Sets some text according to the class
function setModalText(objectClass){
    let string = ''
    switch(objectClass){
        case 'melchor':
            string = 'El villancico es un género de cancion cuya letra hace referencia a la navidad.';
            break;
        case 'baltazar':
            string = 'A la nanita nana es un villancio compuesto por Jeremías Quinetero, oriundo de Barbacoas, Nariño.';
            break;
        case 'gaspar':
            string = 'La palabra tutaina es utilizada en Perú para referirse coloquialmente a una fiesta pequeña, por lo que el título de este villancico se refiere a la celebración de la tradicional novena de aguinaldos.';
            break;
        case 'jose':
            string = 'En Ecuador, México, Colombia, Guatemala, El Salvador, Venezuela, Perú, Argentina, Chile y Canarias, la figura del niño Jesús se coloca despúes de la llegada de la navidad.';
            break;
        case 'pastor':
            string = 'A las novenas se les llama "Las posadas" y son fiestas populares de Mexico, Honduras, Guatemala, El Salvador, Costa Rica, Nicaragua y Panamá.';
            break;
        case 'mula':
            string = 'En las posadas, cada uno de los nueve días representa un valor, como humildad, fortaleza, desapego, caridad, confianza, justicia, pureza, alegría y generosidad.';
            break;
        case 'jesus':
            string = 'El villancico es un género de canción cuya letra hace referencia a la navidad.';
            break;
        case 'maria':
            string = 'La primera celebración navideña en la que se montó un pesebre para la conmemoraciónd del nacimiento de Jesús fue en la nochebuena del año 1223, realizada por San Francisco de Asís.';
            break;
    }
    return string;
}

//Loads each audio to the beat
function playAudio(string){
    switch (string){
        case 'intro':
            beat = new Audio('Audio/intro.mp3');
            break;
        case 'final':
            beat = new Audio('Audio/final.mp3');
            break;
        case 'melchor':
            beat = new Audio('Audio/pareja1.mp3');
            break;
        case 'baltazar':
            beat = new Audio('Audio/pareja2.mp3');
            break;
        case 'gaspar':
            beat = new Audio('Audio/pareja3.mp3');
            break;
        case 'jose':
            beat = new Audio('Audio/pareja4.mp3');
            break;
        case 'pastor':
            beat = new Audio('Audio/pareja5.mp3');
            break;
        case 'mula':
            beat = new Audio('Audio/pareja6.mp3');
            break;
        case 'jesus':
            beat = new Audio('Audio/pareja7.mp3');
            break;
        case 'maria':
            beat = new Audio('Audio/pareja8.mp3');
            break;
        case 'correcta':
            beat = new Audio('Audio/correcta.mp3');
            break;
        case 'incorrecta':
            beat = new Audio('Audio/incorrecta.mp3');
            break;
    }
    beat.play();
}

//Detects when a card is clicked and apllies game functionality
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

startBtn.addEventListener('click', ()=> {
    startBtn.parentNode.parentNode.parentNode.classList.toggle('hide-modal');
    document.querySelector('body').classList.toggle('no-scroll')
    playAudio('intro')
});

gameBtn.addEventListener('click', ()=> {
    if (counter == 8) location.reload();
    gameBtn.parentNode.parentNode.parentNode.parentNode.parentNode.classList.toggle('hide-modal');
    document.querySelector('body').classList.toggle('no-scroll')
    beat.pause();
});




createCards(game);