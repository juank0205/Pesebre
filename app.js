/*
Author: Ing(c) Juan Camilo Echeverry
Primer Bootcamp "piscina-42" UTP sobre fullstack
Date: 2023-01-13
*/

//Start at the top
window.scrollTo(0, 0);


//Shuffle an array's content
const shuffle = array => array.sort(() => Math.random() - 0.5);

//Array containing all possible cards
let pairs = ["maria", "maria", "jose", "jose", "jesus", "jesus", "melchor", "melchor", "gaspar", "gaspar", "baltazar", "baltazar", "pastor", "pastor", "mula", "mula"];
shuffle(pairs);

//Creating game objects and state variables
const startBtn = document.getElementById("btn-comenzar");       //Store the button on the intro modal
const gameBtn = document.getElementById("btn-juego");           //Store the button on the game modal
const finalBtn = document.getElementById("btn-final");          //Store the button on the final modal
const gameModal = document.getElementById("modal-juego");       //Store the game modal
const finalModal = document.getElementById("modal-final");      //Store the final modal
const textModal = document.getElementById("texto");             //Store the text holder of the game modal
const game = document.getElementById("game");                   //Store the container that holds the cards
let counter = 0;                                                //Variable that counts the amount of pairs discovered
let beat = new Audio('');                                       //Store the audio Object
let templateCard = document.getElementById("template-card").content;    //Store the card template on the template card
let state = [0, null];                                          //State variable (1st position: State of the app, 2nd position: Last card clicked)

//Spawns 16 cards with their respective class
function createCards(){
    let clone;  // Set a clone variable to store each instance of the cards
    for (let i=0; i<16; i++){
        clone = templateCard.cloneNode(true);   //Clone the template for the card structure
        clone.querySelector('.carta').id = 'carta-' + i;    //Set an unique id to the card
        clone.querySelector(".card-back").classList.add(pairs[i]);  //Set the card a class from the random pairs array
        document.getElementById(Math.ceil((i+1)/4)).appendChild(clone); //Append the card on its corresponding row
        let carta = document.getElementById('carta-' + i);  //Store the card that was appended to apply an spawn animation
        setTimeout(() => {
            carta.classList.toggle("hide-modal"); //Make the card show with a specific delay
        }, 200 + (150 * i));
        setTimeout(() => {
            carta.classList.toggle("cardAnimation"); //Make the card show the animation with a specific delay
        }, 200 + (150 * i));
    }
}

//Flips the card (animation)
const flipCard = card => card.parentNode.classList.toggle('is-flipped');

//Game functionality
function checkState(state, target){
    switch (state[0]){ //The game has two states (1st click and 2nd click)
        case 1:
            state[1] = target; //Store the object that was clicked
            break;
        case 2:
            setTimeout(() => { //delay to wait for the animation to complete before validating classes
                if (state[1].classList[3] == target.classList[3]){ //Class validation betwwen the last object clicked and the one stored from the first click
                    counter++; //A pair has been discovered
                    playAudio('correcta'); //Play audio
                    state[0] = 0; //Reset state
                    if (counter == 8){
                        winnerModal(); //If all pairs have been discovered, show end modal
                    } else{
                        setTimeout(()=>playAudio(state[1].classList[3]), 300) //If game is not over, play the corresponding audio
                        updateModal(state[1].classList[3]); //Update the modal info to be displayed
                    }
                    return;
                }
                playAudio('incorrecta'); //If pair is not correct, play audio
                flipCard(state[1]); //Flip both cards back
                flipCard(target);
                state[0] = 0; //Reset state
            }, 800);
            break;
    }
}

//Modal funcitonality
function updateModal(objectClass){
    window.scrollTo(0, 0); //Scroll to the top of the page
    gameModal.classList.toggle("hide-modal"); //Show the modal
    document.querySelector('body').classList.toggle('no-scroll'); //Prevent scroll
    document.querySelector('.modal-'+ objectClass).classList.toggle('show-item'); //Start the animation to uncover the background
    textModal.innerText = setModalText(objectClass); //Set the modal text content
    setTimeout(() => { //Waits for the flipping animation
        document.querySelector('.modal-' + objectClass).classList.toggle('show-item'); //Start the uncover animation
        document.querySelector('.modal-' + objectClass).classList.toggle('hide-modal'); //Dissapear the cover
    }, 3000);
}

//Winner modal
function winnerModal(){
    window.scrollTo(0, 0); //Scroll to the top
    playAudio('final'); //Play audio
    finalModal.classList.toggle("hide-modal"); //Show the modal
    document.querySelector('body').classList.toggle('no-scroll'); //prevent scrolling
}

//Sets some text according to the class
function setModalText(objectClass){
    let string = ''
    switch(objectClass){
        case 'melchor':
            string = 'El villancico es un género de cancion cuya letra hace referencia a la navidad.';
            break;
        case 'baltazar':
            string = 'A la nanita nana es un villancio compuesto por Jeremías Quintero, oriundo de Barbacoas, Nariño.';
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
const playAudio = (string) => {
    beat = new Audio('./Audio/' + string + '.mp3') //Set the audio path acording to the class or string given
    beat.play();
};

//Detects when a card is clicked and apllies game functionality
game.addEventListener('click', event =>{
    const target = event.target; //Store the click target
    const card = target.parentNode.children[1]; //Select the back face of the card

    if (state[1] != null && state[0] == 2) return; //If the card has been clicked and already found a pair, return
    if (!(target.classList.contains('card-face'))) return; //If for some reason, the target is not a card, return
    if ((target.parentNode.classList.contains('is-flipped'))) return; //If the card has been flipped return
    
    flipCard(target); //Flip the card
    state[0]++; //Go to the next state
    checkState(state, card); //Check the pairs
    event.stopPropagation();
});

//Start button
startBtn.addEventListener('click', ()=> {
    startBtn.parentNode.parentNode.parentNode.classList.toggle('hide-modal'); //Hide the intro modal
    document.querySelector('body').classList.toggle('no-scroll') //Enable scroll
    playAudio('intro') //Play intro audio
});

//End game button
finalBtn.addEventListener('click', ()=> {
    if (counter == 8) location.reload(); //Reload the page
});

//In game modal button
gameBtn.addEventListener('click', ()=> {
    gameBtn.parentNode.parentNode.parentNode.parentNode.parentNode.classList.toggle('hide-modal'); //Go to the modal path and show it
    document.querySelector('body').classList.toggle('no-scroll') //Enable scroll
    beat.pause(); //Stop music currently playing
});

createCards(); //Start the game
