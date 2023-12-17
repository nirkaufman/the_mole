/*
   The Mole game description:
   - First screen will include:
     - score - start as 0 (zero)
     - time left - 30 seconds
     - mole holding 'start sign' in one hole
     - all the other holes should be empty (no mole)
   - When clicking on the mole holding 'start' sign
     - game is starting
     - time start to count down
     - mole appear randomly within random time period
     - mole disappear after a period of time
   - while clicking on a hole where the mole is visible:
     - if game is over (timer is zero) do nothing
     - mole face change to 'hit'
     - score goes up, one point
     - mole disappear
   - which clicking on a hole where the mole is not visible
     - do nothing
   - when the time is up:
     - game is over
     - game reset (first screen): score, time, all holes should be empty
 */

// Initial screen (state)
// create an object with all the relevant game information
const game = {
  score: 0,
  time: 10,
  gameOver: true
}

/*
  We will need a random number for both choosing a random hole,
  and define random time
 */
function generateRandomNumber(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

// Get reference to all DOM elements needed
const scoreElement = document.getElementById('score');
const holesElements = document.getElementsByClassName('hole');
const timerElement = document.getElementById('time');

/*
  This function get executed when clicking on
  a 'hole div' (div with the css class named 'hole)
 */
function whack(event) {
  // check if the game is over - if so - do nothing
  if(game.gameOver) return;

  // When the class 'up' presents - the mole is visible
  if(event.target.classList.contains('up')) {
    // the 'hit' change the mole image
    event.target.classList.replace('up', 'hit');

    // update the score adding one point
    game.score += 1;

    // update the UI to show the new score
    scoreElement.innerText = game.score;

    // removing the 'hit' class will make the mole disapear
    setTimeout(() => {
      event.target.classList.remove('hit');
    }, 800)
  }
}

/*
  Handle Mole appearance in random hole.
  add the class 'up' on one of the holes div (div with CDD class hole)
  and after a period of time, remove the class 'up' to make it disappear
 */
function moleAppear() {
  // If game over, return
  if(game.gameOver) return;

  // generate random number between 0 and the number of holes
  const randomNumber = generateRandomNumber(holesElements.length);

  // the holes are collection of divs
  // get one of the holes with this number as an index
  const randomHoleElement = holesElements[randomNumber]

  // add the class 'up' to make the mole appear
  randomHoleElement.classList.add('up');

  // after some time, remove the class 'up' to make it disappear
  setTimeout(() => {
    randomHoleElement.classList.remove('up');
    moleAppear();
  }, 1000)

}


/*
  Executed when clicking on the hole with the class 'start'
  starts the game: start a counter, and call moleAppear
 */
function startGame() {
  // first, set gameOver flag to false
  game.gameOver = false;

  // remove the start class from the first hole
  // and attach whack to the click event
  holesElements[0].classList.remove('start');
  holesElements[0].addEventListener('click', whack);

  // start a timer that updates the game time
  const timerId = setInterval(() => {
    // when the time is up (time is zero)
    if(game.time === 0) {
      // stop the timer
      clearInterval(timerId);
      resetGame();
    } else {
      // update the game state
      game.time -= 1;

      // sync the UI
      timerElement.innerText = game.time;
    }
  }, 1000);

  moleAppear();
}


/*
  init game, reset all the values to the starting point
  and show the mole with the class start so we cam start the game
 */
function resetGame() {
  // reset game to initial values
  game.gameOver = true;
  game.score = 0;
  game.time = 30;

  // sync the UI
  timerElement.innerText = game.time;
  scoreElement.innerText = game.score;

  // attach the function whcak() to all holes divs
  for (let i = 0; i < holesElements.length; i++) {
    holesElements[i].addEventListener('click', whack);
  }

  // The first 'hole' should have the class 'start'
  // and when it clicked - it shoud call start game;
  holesElements[0].classList.add('start');
  holesElements[0].addEventListener('click', startGame);
}


resetGame();

// Test
