/*
 * Create a list that holds all of your cards
 */
let objects = [];

let cardSet = [];
let previousOpened = null; //store an opened card, waiting to be compared to another one 
let moves = 0, // number of pairs of flipped cards
    locked = 0, // number of pairs of matching flipped cards
    ratingStars = 5; //from 0 to 5, depending of ratingPercent

let level = "";
let hours = 0,
    mins = 0,
    secs = 0; //used by the timer function
idTimer = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card"s HTML to the page
 */


//------------------------------------------------------------
function shuffle(array)
//------------------------------------------------------------
{
    //Shuffle function from http://stackoverflow.com/a/2450976
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card"s symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card"s symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//------------------------------------------------------------
function createObjectsArray()
//------------------------------------------------------------
{
    //this function fills the objects array with objects selected from scratchObjects bellow

    let scratchObjects = [ // 26 objects
        "anchor",
        "bicycle",
        "bolt",
        "bomb",
        "cube",
        "diamond",
        "leaf",
        "paper-plane-o",
        /*first 8 objects (I mean real life objects, not java stuffs) used for the beginner level
         *(less cards and very different easy-to-remember objects)
         */
        "toggle-down",
        "toggle-left",
        "toggle-right",
        "toggle-up",
        "user",
        "user-circle",
        "user-circle-o",
        "user-o",
        /*cards from 9 to 16 (8 cards) used for intermediate level
         *(still less cards but almost alike objects that needs more attention)
         */
        "hourglass",
        "hourglass-start",
        "hourglass-half",
        "hourglass-o",
        "hourglass-end",
        "thermometer-0",
        "thermometer-1",
        "thermometer-2",
        "thermometer-3",
        "thermometer-4"
        /*from 9 to 26 (18 cards) used for the hardest level
         *(more cards of almost alike objects that 
         *needs very much attention)
         */
    ];
    let iStart, iEnd;

    if (level === "beginner") {
        iStart = 0;
        iEnd = 8;
    } else if (level === "intermediate") {
        iStart = 8;
        iEnd = 16;
    } else if (level === "chuck norris") {
        iStart = 8;
        iEnd = 26;
    }

    objects.length = 0; //remove the previous objects and get aa empty array 
    for (let i = iStart; i < iEnd; i++) {
        objects.push(scratchObjects[i]);
    }
    cardSet = objects.concat(objects); //double objects array because every object appears on two cards
}

//------------------------------------------------
let calcAndApplySizes = function () //callback for resize 
//-----------------------------------------------
{
    //calculate cards sizes to fits on different screen sizes
    //also, the number of cards is variable depending of the difficulty level

    let cardDeck = document.getElementById("cards-board");
    let cards = cardDeck.getElementsByClassName("card");

    let cardH = 0,
        cardW = 0, //W and H of a card
        minWindowSizee; // size of the smaller side of the window 


    minWindowSize = Math.min(window.innerWidth, window.innerHeight);

    let computedSize = Math.max(360 /*min width*/ , Math.min(640 /*max width*/ , minWindowSize));

    let padding = computedSize * 0.05;

    if (level === "beginner" || level === "intermediate") {
        //it mean there are 16 cards, also 4 rows and 4 columns
        cardW = (Math.round((computedSize - 4 * padding) / 4)).toString() + "px";
    } else {
        //level is chuck norris
        //it mean there are 36 cards, also 6 rows and 6 columns
        cardW = (Math.round((computedSize - 3 * padding) / 6)).toString() + "px";
    }
    cardH = cardW; //square shaped
    cardDeck.style.width = computedSize + "px";
    cardDeck.style.height = cardDeck.style.width;
    cardDeck.style.padding = padding + "px";
    document.body.style.width = computedSize + padding + "px";
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.width = cardW;
        cards[i].style.height = cardH;
    }
}
//------------------------------------------------
function display()
//-----------------------------------------------
{
    //generate HTML text to display the cards on the page

    let currentIndex = cardSet.length;
    let cardDeck = document.getElementById("cards-board");

    //it is supposed that now cards-board is empty because: 1.document just was loaded or 2.a restart request

    while (currentIndex !== 0) {
        let node = document.createElement("li");
        let card = document.createElement("i");
        node.classList.add("card");
        card.classList = ("fa " + "fa-" + cardSet[currentIndex - 1]);
        node.appendChild(card);
        cardDeck.appendChild(node);
        currentIndex -= 1;
    }
    calcAndApplySizes();
}
//------------------------------------------------------------
document.addEventListener("click", function (event)
    //------------------------------------------------------------
    {
        //set up the event listener for a card

        let classNameString = event.target.className.toLowerCase();
        if (classNameString === "card") {
            flipClickedCard(event.target);

            if (previousOpened === null) {
                previousOpened = event.target; //store this event.target (class card), it will be compared with next one clicked
                //there is nothing to compare yet, because a single card was flipped
            } else //previousOpened!== null then event.target is the second card opened, so there are now 2 cards to be compared
            {
                compareCards(event.target);
            }
        } else if (classNameString === "levels-item") {
            //popus to confirma action
            //sweetalert2 popus from https://sweetalert2.github.io/
            let strItem = event.target.innerHTML;

            if (strItem != level) {
                swal({
                    type: 'warning',
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Yes, hurry up!',
                    confirmButtonColor: "green",
                    cancelButtonColor: "red",
                }).then((result) => {
                    if (result.value) {
                        document.getElementsByClassName("game-level")[0].innerHTML = strItem;
                        restart(strItem); //restart on a different difficulty level
                    } else {
                        swal(
                            'Wise!',
                            'Now back to work',
                            'success'
                        )
                    }
                })
            }
        } else if (classNameString === "restart" || classNameString === "fa fa-repeat") {
            //popus to confirma action
            //sweetalert2 popus from https://sweetalert2.github.io/
            swal({
                type: 'warning',
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, hurry up!',
                confirmButtonColor: "green",
                cancelButtonColor: "red",
            }).then((result) => {
                if (result.value) {
                    restart(level); //restart on a different difficulty level
                } else {
                    swal(
                        'Wise!',
                        'Now back to work',
                        'success'
                    )
                }
            })
        }
    });

//------------------------------------------------------------
function addEvent(object, type, callback)
//------------------------------------------------------------    
{
    //addEvent from https://stackoverflow.com/questions/641857/javascript-window-resize-event
    //used for recalculate the cards sizes when the window is resized

    if (object == null || typeof (object) == "undefined") return;
    if (object.addEventListener) {
        object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
        object.attachEvent("on" + type, callback);
    } else {
        object["on" + type] = callback;
    }
};

//------------------------------------------------------------
function compareCards(card)
//-------------------------------------------------------------
{
    //compare an opening card with the one previously flipped
    let firstToCompare = card.firstChild,
        secondToCompare = previousOpened.firstChild;

    setTimeout(function () {

        if (firstToCompare.className === secondToCompare.className) //same cards?
        {
            lockCards(card, previousOpened); //then lock them opened
            modifyScores(true);
            checkFinished(); //verify if the game it"s over (when all cards are locked)
        } else //not same cards?
        {
            restoreCards(card, previousOpened); //then flip them back
            modifyScores(false);
        }

    }, 600);
}

//------------------------------------------------
function flipClickedCard(card)
//------------------------------------------------
{
    // display the card"s symbol

    card.classList.add("open", "show");

    //"open" class necessary only to have animation when a card is flipping, "show" class to show content at the end of the animation 
}

//------------------------------------------------
function lockCards(card1, card2)
//------------------------------------------------
{
    //function to lock matching card

    card1.className = "card match";
    card2.className = "card match";
    previousOpened = null;
};

//--------------------------------------------------
function restoreCards(card1, card2)
//------------------------------------------------
{
    // flip back unmatching cards
    setTimeout(function () {
        card1.className = "card";
        card2.className = "card";

    }, 500);

    card1.className = "card show unmatch";
    card2.className = "card show unmatch";

    previousOpened = null;
}
//--------------------------------------------------
function modifyScores(boolGuessed)
//------------------------------------------------
{
    moves++;
    document.getElementsByClassName("moves")[0].innerHTML = moves.toString() + " Moves";
    if (boolGuessed) //a pair of same card was flipped?
    {
        locked++;
    }
    calculateRatingStars();
}
//--------------------------------------------------
function calculateRatingStars()
//--------------------------------------------------
{
    // a player with a perfect remembrance needs no more than (objects.length) moves
    // in order to flip and remember all cards and theirs positions. 
    // then, after first (objects.length) moves, if nothing was guessed, this player should be able to
    // lock all cards within the next (objects.length) moves.
    // so, actually it needs max. 2*(objects.length) moves to finish the game
    // the rating is a number that represent the difference between two percent: 1.moves done vs. moves needed and
    // 2.the number of locked pairs vs. the number of pairs that should be guessed and locked at the moment (shouldBePercent)

    let shouldBePercent = moves / (objects.length * 2);
    let currentPercent = locked / objects.length;

    // calculate the number of stars
    // 5 stars rating, so it should be 6 intervals for rating percent
    // 0-16% = 0 stars, 16-32% = 1 stars, 32-48% = 2 stars, 48-64% = 3 stars, 64-83% = 4 stars, 83-100% = 5 stars
    // 
    let ratingPercent = 1 - (shouldBePercent - currentPercent); // ratingPercent starts from 1 
    //and decrease after every move if a non-matching pairs of cards was flipped;
    let tempStars;

    if (ratingPercent <= 0.16) { //ratingPercent can go negative if there are to many moves 
        tempStars = 0;
    } else if (ratingPercent > 0.16 && ratingPercent <= 0.32) {
        tempStars = 1;
    } else if (ratingPercent > 0.32 && ratingPercent <= 0.48) {
        tempStars = 2;
    } else if (ratingPercent > 0.48 && ratingPercent <= 0.64) {
        tempStars = 3;
    } else if (ratingPercent > 0.64 && ratingPercent <= 0.83) {
        tempStars = 4;
    } else {
        tempStars = 5;
    }
    //redraw the score panel
    if (tempStars != ratingStars) //prevent redraw continuoulsy the same content
        redrawScorePanel(tempStars);
}
//--------------------------------------------------
function redrawScorePanel(newStars)
//--------------------------------------------------
{
    let starsPanel = document.getElementsByClassName("stars")[0];
    let stars = starsPanel.getElementsByTagName("li");

    for (let i = stars.length; i > 0; i--) {
        if (newStars < i)
            stars[i - 1].children[0].className = "fa fa-star-o";
        else
            stars[i - 1].children[0].className = "fa fa-star";
    }
    ratingStars = newStars;
}
//--------------------------------------------------
function restart(newLevel)
//--------------------------------------------------
{
    emptyCardsBoard();
    startGame(newLevel);
}
//--------------------------------------------------
function emptyCardsBoard()
//--------------------------------------------------
{
    //reset all game variables, ready to start a new game
    let cardDeck = document.getElementById("cards-board");

    while (cardDeck.firstChild) {
        cardDeck.removeChild(cardDeck.firstChild);
    } //remove all previous cards

    resetTimer();

    previousOpened = null;
    moves = 0;
    locked = 0;
    ratingStars = 5;
    document.getElementsByClassName("moves")[0].innerHTML = moves;
    redrawScorePanel(ratingStars);
}
//-----------------------------------------------------
function checkFinished()
//-----------------------------------------------------
{
    //check if all cards are locked and show popup
    if (locked === objects.length) {
        popupCongrats();
    }
}
//-----------------------------------------------------
function popupCongrats()
//-----------------------------------------------------
{
    clearInterval(idTimer); // stop timer

    let strCongrats = "You have finished this game in only ";
    if (hours > 0)
        strCongrats += hours + " hours, ";
    else if (mins > 0)
        strCongrats += mins + " minutes, ";

    strCongrats += secs + " seconds. ";
    strCongrats += "You've got " + ratingStars + " stars. Wanna play again?";

//popus to congrats the player
// I use sweetalert2 popus from https://sweetalert2.github.io/
    swal({
        type: 'success',
        title: 'Good job!\n',
        text: strCongrats,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes, please!',
        cancelButtonText: 'Umm, maybe later!',
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        animation: true,
        customClass: 'animated tada'
    })
    .then((result) => {
        if (result.value) {
            restart(level); //restart on a different difficulty level
        } else {
            swal(
                'Ok, take your time!',
                "I'll be here",
                'success'
            )
        }
    })
}
//-----------------------------------------------------
function resetCard(card1, card2)
//-----------------------------------------------------
{
    //reset card to initial state (hidden)
    card1.className = "card";
    card2.className = "card";
}
//-----------------------------------------------------
function setTimer()
//-----------------------------------------------------
{
    let id = setInterval(function () {
        if (secs === 59) {
            secs = 0;
            if (mins === 59) {
                mins = 0;
                hours++;
            } else {
                mins++;
            }
        } else {
            secs++;
        }
        let strTimer = hours.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) + ":" +
            mins.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) + ":" +
            secs.toLocaleString("en-US", {
                minimumIntegerDigits: 2,
                useGrouping: false
            });
        document.getElementsByClassName("timer")[0].innerHTML = strTimer;
    }, 1000);
    return id;
};
//-----------------------------------------------------
function resetTimer()
//-----------------------------------------------------
{
    secs = 0;
    mins = 0;
    hours = 0;
    clearInterval(idTimer);
}
//-----------------------------------------------------
function startGame(strLevel)
//-----------------------------------------------------
{
    level = strLevel;
    createObjectsArray();
    shuffle(cardSet);
    display(cardSet);
    idTimer = setTimer();
}
addEvent(window, "resize", calcAndApplySizes);
startGame("beginner");