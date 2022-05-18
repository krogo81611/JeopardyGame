//Initialize the game board on page load.
document.querySelector('#start-game').addEventListener('click',buildCategories)
initBoard();
initCatRow();

function initCatRow() {
    let catRow = document.getElementById('category-row')

    for(let j=0; j<6; j++) {
        let box = document.createElement('div'); 
        box.className = 'category-box clue-box';
        catRow.appendChild(box)
    }
}

function initBoard() {
    let board = document.getElementById('clue-board')

    //Generate 5 Rows, then place 6 boxes in each row. Append to board

    for (let i = 0; i<5; i++) {
        let row = document.createElement('div');
        let boxValue = 200*(i+1);
        row.className = 'clue-row'

        for(let j=0; j<6; j++) {
            let box = document.createElement('div'); 
            box.className = 'clue-box';
            box.textContent = `$${boxValue}`
            box.addEventListener('click', getClue, false)
            row.appendChild(box)
        }
        board.appendChild(row)
    }

}
let catArray =[]

function buildCategories() {

    if(!(document.querySelector('#category-row').firstChild.innerText == '')) {
        resetBoard()
    }

    const getCategory1 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const getCategory2 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const getCategory3 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const getCategory4 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const getCategory5 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const getCategory6 = fetch(
        `https://jservice.io/api/category?&id=${randInt()}`
    ).then(res => res.json())

    const allData = Promise.all([getCategory1, getCategory2, getCategory3, getCategory4, getCategory5, getCategory6])
    allData.then(res => {
        catArray = res;
        setCategories(catArray);
    })
    
}

function resetBoard() {
    let clueParent = document.getElementById('clue-board')
    while(clueParent.firstChild) {
        clueParent.removeChild(clueParent.firstChild)
    }
    let catParent = document.getElementById('category-row')
    while(catParent.firstChild) {
        catParent.removeChild(catParent.firstChild)
    }
    document.getElementById('score').innerText = 0;
    initBoard()
    initCatRow()
}

//Load Categories to Board

function setCategories(arr) {
    let element = document.getElementById('category-row');
    let children = element.children;
    for (let i=0; i<children.length; i++) {
        children[i].innerHTML = arr[i].title;
    }
}



function randInt() {
    return Math.floor(Math.random()*18419)
}


function getClue(event) {
    let child = event.currentTarget;
    child.classList.add('clicked-box');
    let boxValue = child.innerHTML.slice(1);
    let parent = child.parentNode;
    let index = Array.prototype.findIndex.call(parent.children, (c) => c === child)
    let cluesList = catArray[index].clues
    let clue = cluesList.find(obj => {
        return obj.value == boxValue;
    })
    showQuestion(clue, child, boxValue)
}

function showQuestion(clue, target, boxValue) {
    let userAnswer = prompt(clue.question).toLowerCase();
    let correctAnswer = clue.answer.toLowerCase().replace(/<\/?[^>]+(>|$)/g,'');
    let possiblePoints = +(boxValue);
    target.innerHTML = clue.answer;
    target.removeEventListener('click',getClue,false)
    evaluateAnswer(userAnswer,correctAnswer,possiblePoints)
}


function evaluateAnswer (userAnswer,correctAnswer,possiblePoints) {
    let checkAnswer = (userAnswer == correctAnswer) ? 'correct' : 'incorrect'
  
    let confirmAnswer = 
    confirm(`For $${possiblePoints}, you answered "${userAnswer}", the correct answer is "${correctAnswer}". Your answer appears to be ${checkAnswer} click OK to accept or click Cancel if the answer was not properly evaluated.`)
    awardPoint(checkAnswer, confirmAnswer, possiblePoints)
}

function awardPoint(checkAnswer, confirmAnswer, possiblePoints) {
    if (!(checkAnswer == 'incorrect' && confirmAnswer == true)) {
        let target = document.getElementById('score')
        let currentScore = +(target.innerText)
        currentScore += possiblePoints;
        target.innerText = currentScore;
    } else { 
        alert('No Points Awarded')

    }
}