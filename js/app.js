/*
 * Create a list that holds all of your cards
 */
var objects = [
    /*
    "anchor",
    "bicycle",
    "bolt",
    "bomb",
    "cube",
    "diamond",
    "leaf",
    "paper-plane-o"
    */
]; //eigth objects array

var cardSet = [];
var previousOpened = null; //store an opened card, waiting to be compared to another one 
var moves = 0, // number of pairs of flipped cards
    locked = 0, // number of pairs of matching flipped cards
    ratingStars = 5; //from 0 to 5, depending of ratingPercent

var level = "beginner";

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


//------------------------------------------------------------
function shuffle(array)
//------------------------------------------------------------
{
    //Shuffle function from http://stackoverflow.com/a/2450976
    var currentIndex = array.length,
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
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
//------------------------------------------------------------
function createObjectsArray()
//------------------------------------------------------------
{
//this function fills the objects array with objects selected from scratchObjects bellow

    var scratchObjects = [// 26 objects
    "anchor",
    "bicycle",
    "bolt",
    "bomb",
    "cube",
    "diamond",
    "leaf",
    "paper-plane-o",
    //first 8 objects used for the beginner level (less cards and very different easy-to-remember objects)
    "toggle-down",
    "toggle-left",
    "toggle-right",
    "toggle-up",
    "user",
    "user-circle",
    "user-circle-o",
    "user-o",
    //cards from 9 to 16 (8 cards) used for intermediate level ( still less cards but almost alike objects that needs more attention)
    "hourglass",
    "hourglass-1",
    "hourglass-2",
    "hourglass-3",
    "hourglass-end",
    "thermometer-0",
    "thermometer-1",
    "thermometer-2",
    "thermometer-3",
    "thermometer-4"
    //from 9 to 26 (18 cards) used for top level ( more cards of almost alike objects that needs very much attention)
];
    var iStart, iEnd;

    if(level === "beginner")
    {
        iStart = 0;
        iEnd = 8;
    }
    else if(level === "intermediate")
    {
        iStart = 8;
        iEnd = 16;
    }
    else if(level === "chuck norris")
    {
        iStart = 8;
        iEnd = 26;
    }

    objects.length = 0;//remove the previous objects and get a clean array to fil
    for(var i = iStart; i < iEnd; i++)
    {
        objects.push(scratchObjects[i]);
    }
    cardSet = objects.concat(objects); //double objects array because every object appears on two cards
}
//------------------------------------------------
function display()
//-----------------------------------------------
{
    //generate HTML text to display the cards on the page

    var currentIndex = cardSet.length;
    var cardDeck = document.getElementById("cards-board");

    //it is supposed that now cards-board is empty because: 1.document just was loaded or 2.a restart request

    while (currentIndex !== 0) {
        var node = document.createElement("li");
        var card = document.createElement("i");
        node.classList.add("card");
        card.classList = ("fa " + "fa-" + cardSet[currentIndex - 1]);
        node.appendChild(card);
        cardDeck.appendChild(node);
        currentIndex -= 1;
    }
}
//------------------------------------------------------------
document.addEventListener("click", function (event)
    //------------------------------------------------------------
    {
        //set up the event listener for a card

        var classNameString = event.target.className.toLowerCase();
        if (classNameString === "card") {
            flipClickedCard(event.target);

            if (previousOpened === null) {
                previousOpened = event.target; //store this event.target (card), it will be compared with next one clicked
                //there is nothing to compare yet, because a single card was flipped
            } else //previousOpened!== null then event.target is the second card opened, so there are now 2 cards to be compared
            {
                compareCards(event.target);
            }
        } 
        else if(classNameString === "levels-item")
        {
            var strItem = event.target.innerHTML;

            if(strItem != level)
            {
                if (confirm("This will stop the game and delete all you have done. Are you sure?"))
                {
                    document.getElementsByClassName("game-level")[0].innerHTML = strItem;
                    restart(strItem);//restart with different level
                }
            }
        }
        else if (classNameString === "restart" || classNameString === "fa fa-repeat")
        {
            if (confirm("This will stop the game and delete all you have done. Are you sure?"))
            {
                restart(level);//just restart, keep the same level
            }
        }
    });

//------------------------------------------------------------
function compareCards(card)
//-------------------------------------------------------------
{
    //compare an opening card with the one previously flipped
    var firstToCompare = card.firstChild,
        secondToCompare = previousOpened.firstChild;
    setTimeout(function () {

        if (firstToCompare.className === secondToCompare.className) //same cards?
        {
            lockCards(card, previousOpened); //then lock them opened
            modifyScores(true);
            checkFinished();//verify if the game it's over (when all cards are locked)
        }
        else //not same cards?
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
    // display the card's symbol

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
    setTimeout(function(){
        card1.className = "card";
        card2.className = "card";
        card1.style.transition = "";
        card2.style.transition = "";
    },500);

    card1.style.transition = "none";
    card2.style.transition = "none";

    card1.className = "card show unmatch";
    card2.className = "card show unmatch";

    previousOpened = null;
}
//--------------------------------------------------
function modifyScores(boolGuessed)
//------------------------------------------------
{
    moves++;
    document.getElementsByClassName("moves")[0].innerHTML = moves;
    if(boolGuessed)//a pair of same card was flipped?
    {
        locked++;
    }
    calculateRatingStars();
}
//--------------------------------------------------
function calculateRatingStars()
//--------------------------------------------------
{
// a player having a perfect remembrance needs no more than (objects.length) moves
// in order to flip and remember all cards and theirs positions. 
// then, after 8 moves, if nothing was guessed, this player should be able to
// lock all cards within the next (objects.length) moves.
// so, actually it needs max. 8+8 moves to finish the game
// the rating is a number that represent the difference between two percent: 1.moves done vs. moves needed and
// 2.the number of locked pairs vs. the number of pairs that should be guessed and locked at the moment (shouldBePercent)

// ratingPercent decrease after every move if a non-matching pairs of cards was flipped;

    var shouldBePercent = moves/(objects.length*2);
    var currentPercent = locked/objects.length;

// calculate the number of stars
// 5 stars rating, so it should be 4 intervals for rating percent
// 0-16% = 0 stars, 16-32% = 1 stars, 32-48% = 2 stars, 48-64% = 3 stars, 64-83% = 4 stars, 83-100% = 5 stars
// 
    var ratingPercent = 1-(shouldBePercent - currentPercent);
    var tempStars;

    if(ratingPercent >= 0 && ratingPercent <= 0.16)
    {
        tempStars = 0;
    }
    else if(ratingPercent > 0.16 && ratingPercent <= 0.32)
    {
        tempStars = 1;
    }
    else if(ratingPercent > 0.32 && ratingPercent <= 0.48)
    {
        tempStars = 2;
    }
    else if(ratingPercent > 0.48 && ratingPercent <= 0.64)
    {
        tempStars = 3;
    }
    else if(ratingPercent > 0.64 && ratingPercent <= 0.83)
    {
        tempStars = 4;
    }
    else
    {
        tempStars = 5;
    }
    //redraw the score paddingLeft: 
    if(tempStars != ratingStars)//prevent redraw continuoulsy the same content
        redrawScorePanel(tempStars);
}
//--------------------------------------------------
function redrawScorePanel(newStars)
//--------------------------------------------------
{
    var starsPanel = document.getElementsByClassName("stars")[0];
    var stars = starsPanel.getElementsByTagName("li");
    for(var i = stars.length; i > 0; i--)
    {
        if(newStars < i)
            stars[i-1].firstChild.className = "fa fa-star-o";
        else
            stars[i-1].firstChild.className = "fa fa-star";
    }
    ratingStars = newStars;
}
//--------------------------------------------------
function restart(newLevel)
//--------------------------------------------------
{
    var cardDeck = document.getElementById("cards-board");
    emptyCardsBoard();

    level = newLevel;
    previousOpened = null; 
    moves = 0;
    locked = 0;
    ratingStars = 5;

    createObjectsArray();

 //   shuffle(cardSet);
    display(cardSet);
    document.getElementsByClassName("moves")[0].innerHTML = moves;
    redrawScorePanel(ratingStars);

}
//--------------------------------------------------
function emptyCardsBoard()
//--------------------------------------------------
{
    var cardDeck = document.getElementById("cards-board");
    while (cardDeck.firstChild) {
        cardDeck.removeChild(cardDeck.firstChild);
    } //remove all previous cards
}
//-----------------------------------------------------
function checkFinished()
//-----------------------------------------------------
{
    //check if all cards are locked and show popup
    if(locked === objects.length)
        popupCongrats();
}
//-----------------------------------------------------
 function popupCongrats()
 //-----------------------------------------------------
 {
    var strCongrats = "Congratulations!\nYou won this game.\nDo you want to play again?"
    if (confirm(strCongrats))
    {
        restart(level);
    }
 }
//-----------------------------------------------------
function resetCard(card1, card2)
//-----------------------------------------------------
{
    //reset card to initial state 
    card1.className = "card";
    card2.className = "card";
};


createObjectsArray();
//shuffle(cardSet);
display(cardSet);

