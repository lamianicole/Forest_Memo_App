import './style.css'
//* --------------- Selecting HTML elements ---------------
const scoreboard = document.querySelector('.scoreboard') as HTMLDivElement;
const pairsClicked = document.querySelector('#pairsClicked') as HTMLParagraphElement;
const pairsGuessed = document.querySelector('#pairsGuessed') as HTMLParagraphElement;
const cards = document.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

const emojiArr: string[] = ['🌳', '🪵', '🦔', '🐾', '🌰', '🦉', '🦋', '🪲', '🐦‍⬛', '🦡', '🍄‍🟫', '🌲'];

//* --------------- Declaring control variables ---------------
let cardsToCompare: HTMLDivElement[] = [];
let guessCounter: number = 0;
let pairsClickedCounter: number = 0;
let pairsGuessedCounter: number = 0;

//* --------------- Mixing the emojis ---------------
const shuffledArr = shuffleAllCards(emojiArr);
for(let i: number = 0; i < shuffledArr.length; i++) {
    cards[i].innerHTML = `<div class="emoji">${shuffledArr[i]}</div>`;
    const cardChild = cards[i].firstElementChild as HTMLDivElement;
    cardChild.classList.add('hide__card');
}

//* --------------- Declaring functions ---------------
function shuffleAllCards(arr: string[]): string[] {
    const doubleEmojiArr = arr.concat(arr);
    for (let i = doubleEmojiArr.length - 1; i > 0; i--) {
        const arrNum = Math.floor(Math.random()* (i+1));
        [doubleEmojiArr[i], doubleEmojiArr[arrNum]] = [doubleEmojiArr[arrNum], doubleEmojiArr[i]];
    } 

    return doubleEmojiArr;    
}

function compareCards(cardsArr: HTMLDivElement[]): boolean {
    return cardsArr[0].textContent === cardsArr[1].textContent ? true : false;
}

function displayScoreboard(pairGuessed: boolean): void {
    if(pairGuessed) {
        pairsGuessedCounter++;
        if(pairsGuessedCounter === 12) {
            scoreboard.style.flexDirection = 'column';
            scoreboard.style.alignItems = 'center';
            scoreboard.innerHTML = `
            <h3>Congratulations, you won!</h3>
            <p>Attempts: ${pairsClickedCounter}</p>
            `;
            const button = document.createElement('button') as HTMLButtonElement;
            button.textContent = 'Play again!';
            button.classList.add('restart__btn');
            button.addEventListener('click', () => location.reload());
            scoreboard.appendChild(button);
        }
    } else {
        pairsClickedCounter++;
    }
    pairsClicked.textContent = `Pairs clicked: ${pairsClickedCounter}`;
    pairsGuessed.textContent = `Pairs guessed: ${pairsGuessedCounter}`;
}

//* --------------- Button click events ---------------
cards.forEach((card: HTMLDivElement) => {
    card.addEventListener('click', () => {
        if(guessCounter < 2) {
            const cardChild = card.firstElementChild as HTMLDivElement;
            cardChild.classList.toggle('hide__card');
            cardsToCompare.push(cardChild);
            guessCounter++;
            if(guessCounter === 2) {
                const compareResult: boolean = compareCards(cardsToCompare);
                if(compareResult) {
                    displayScoreboard(true);
                    cardsToCompare = [];
                    guessCounter = 0;
                } else {
                    displayScoreboard(false);
                    setTimeout(() => {
                        cardsToCompare.forEach((card) => card.classList.toggle('hide__card'));
                        cardsToCompare = [];
                        guessCounter = 0;
                    }, 1000)
                }
            }
        }
    })
})