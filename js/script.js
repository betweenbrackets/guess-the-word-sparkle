// Create the global variables to select the elements
// In their order in the html
const message = document.querySelector(".message");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
let remainingGuessesSpan = document.querySelector(".remaining span");
const guessedLettersElement = document.querySelector(".guessed-letters");
const letterInput = document.querySelector(".letter");
const guessLetterButton = document.querySelector(".guess");
const playAgainButton = document.querySelector(".play-again");

// Magnolia is the starting word to test out the game
let word = "magnolia";
// Array for all the letters guessed
let guessedLetters = [];
// Set the number of guesses
let remainingGuesses = 8;

// Let's pull the words to guess with an API
const getWord = async function () {
    // create a variable to hold the API response
    // with fetch, apply the await keyword to wait for the function to resolve
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    // apply the text method for fetching data from a text file
    const words = await response.text();
// transform the data fetched into an array
// separate the elements by a line break
    const wordArray = words.split("\n");
    // console.log(wordArray);

// Let's pull a random index
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    // console.log(randomIndex);
    // Let's clean up any white space to avoid errors
    word = wordArray[randomIndex].trim();
    // console.log(word);
    // Let's call the function to display placeholders for our word
    placeholder(word);
};
// Fire off the game
getWord();
// Let's display placeholders for the word's letters
const placeholder = function (word) {
    // set empty array
    const placeholderLetters = [];
    // set loop
    for (const letter of word) {
        // console.log(letter);
        // add element to the array
        placeholderLetters.push("●");
    }
    // update the text of the selected element with array elements joined into a string
    wordInProgress.innerText = placeholderLetters.join(""); 
};


// Let's set the button behavior
// Let's set user input variable
guessLetterButton.addEventListener("click", function (e) {
    // Don't want the default reload behavior
    e.preventDefault();
    // Empty message paragraph
    message.innerText = "";
    // SETTING USER INPUT TO VARIABLE "GUESS"
    const guess = letterInput.value;
    // Let's make sure that the input is a single letter by calling our validate function below with user input as the parameter
    const goodGuess = validateInput(guess);

    if (goodGuess) {
        makeGuess(guess);
    };
    // reset to empty
    letterInput.value = ""; 
});

// Let's validate input (string.length)
const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    // Have you entered a letter?
    if (input.length === 0) {
    message.innerText = "Please enter a letter.";
    // Have you entered more than one letter?
    } else if (input.length > 1) {
        message.innerText = "Please enter only one letter from A to Z.";
    } else if (!input.match(acceptedLetter)) {
        // Have you entered a non-letter?
        message.innerText = "Please enter a letter from A to Z.";
    } else {
        // input is a single letter -- yayness
        return input;
    }
};

// Let's test for duplicate guesses
const makeGuess = function (guess) {
    guess = guess.toUpperCase();
// We've got a duplicate/it's in the array
    if (guessedLetters.includes(guess)) {
        message.innerText = "That letter's been guessed already. Try again."
    } else { // POPULATE THE gUESSEDLETTERS ARRAY
        guessedLetters.push(guess)
        // console.log(guessedLetters);
        // Call the showGuessedLetter function here so that the letter displays only if it hasn't been guessed before
        
        updateGuessesRemaining(guess);
        showGuessedLetters();
        updateWordInProgress(guessedLetters);
    }
};

// Let's display the guessed letters
const showGuessedLetters = function () {
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
};

// Let's update the Word In Progress - push either the character or the symbol
// array as parameter
const updateWordInProgress = function (guessedLetters) {
    // declare word is progress variable and transform to upper case to avoid leter case errors
    const wordUpper = word.toUpperCase();
    // split the string and return as elements in an array
    const wordArray = wordUpper.split("");
    // console.log("This is " + wordArray);
    // set the array of both correct guesses and placeholders
    const revealWord = [];
    // test each element of guessedLetters for a match of wordArray
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            // if match, push the character 
            revealWord.push(letter.toUpperCase())
        } else { // if don't match, push placeholder
            revealWord.push("●")
            }
    }
    //console.log(revealWord);
    // update the text with the new array elements
    wordInProgress.innerText = revealWord.join("");
    checkIfWin();
};

// Let's test the guess and count the remaining guesses
const updateGuessesRemaining = function (guess) {
// establish the case to avoid errors
    const upperWord = word.toUpperCase();
// if guess the letter wrong
    if (!upperWord.includes(guess)) {
        message.innerText = `Sorry, the word has no ${guess}.`;
        remainingGuesses -= 1;
        // if guess right
    } else {
        message.innerText = `Hooray! Good guess! The word has the letter ${guess}.`;
    }
// count down the remaining guesses
    if (remainingGuesses === 0) {
        message.innerHTML = `Game over! The word was <span class="highlight">${word}</span>.`;
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
        startOver();
    } else if (remainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};

// Let's check if we've won yet
const checkIfWin = function () {
    // test the word against the guesses
    if (word.toUpperCase() === wordInProgress.innerText) {
        // if they match, party!
        message.classList.add("win");
        // Let's add that good pumpkin-colored sparkle =)
        message.innerHTML = '<p class="highlight sparkling">You guessed correct the word! Congrats!</p>';
        // Let's call the function to show the Play Again button
        startOver();
    } 
};

// Let's show the Play Again button
const startOver = function () {
    // hide the selected  elements
    guessLetterButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    // show the Play Again button
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function () {
    // reset all original values and grab new word
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    guessedLettersElement.innerHTML = "";
    message.innerText = "";
    // grab the new word
    getWord();

    
    // show the right elements
    guessLetterButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
});
