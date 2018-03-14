/*
 * Create a list that holds all of your cards
 */
var objects = [   
"anchor",
"bicycle",
"bolt",
"bomb",
"cube",
"diamond",
"leaf",
"paper-plane-o"];//eigth objects array

var cardSet = objects.concat(objects);//double objects array because every object appears on two cards
var previousOpened = null;//store an opened card, waiting to be compared to another one 



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
    var currentIndex = array.length, temporaryValue, randomIndex;

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

//------------------------------------------------
function display()
//-----------------------------------------------
{
//generate HTML text to display the cards on the page
   
    var currentIndex = cardSet.length;
    var cardDeck = document.getElementById("cards-board");

//it is supposed that now cards-board is empty because: 1.document just was loaded or 2.a restart request

    while (currentIndex !== 0)
    {
        var node = document.createElement("li"); 
        var card = document.createElement("i");
        node.classList.add("card");
        card.classList = ("fa " + "fa-" + cardSet[currentIndex-1]);
        node.appendChild(card);
        cardDeck.appendChild(node);
        currentIndex -= 1;
    }
}
//------------------------------------------------------------
document.addEventListener("click", function(event)
//------------------------------------------------------------
{
 //set up the event listener for a card

    var classNameString = event.target.className.toLowerCase();
    if (classNameString  === "card" ) 
    {
        flipClickedCard(event.target);

        if(previousOpened === null)
            previousOpened = event.target;//store this event.target (card), it will be compared with next one clicked
            //there is nothing to compare yet, because a single card was flipped

        else //previousOpened!== null then event.target is the second card opened, so there are now 2 cards to be compared
            compareCards(event.target);
            
    }
    else if(classNameString  === "restart" || classNameString  === "fa fa-repeat")
    {
        restart();
    }
});

//------------------------------------------------------------
function compareCards(card)
//-------------------------------------------------------------
{
//compare an opening card with the one previously flipped
    var firstToCompare = card.firstChild, 
        secondToCompare = previousOpened.firstChild;
    if(firstToCompare.className === secondToCompare.className)
        lockMatchingCards(card, previousOpened);
     else
        hideUnMatchingCards(card, previousOpened);

    previousOpened = null;
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
function lockMatchingCards()
//------------------------------------------------
{
//function to lock matching cards
    for (var i = 0; i < arguments.length; i++) 
        arguments[i].className = "card match";
};

//--------------------------------------------------
function hideUnMatchingCards(card1, card2)
//------------------------------------------------
{
// reverse unmatching cards
    resetCard(card1, card2);
}
//--------------------------------------------------
function restart()
//------------------------------------------------
{
    var cardDeck = document.getElementById("cards-board");
    while (cardDeck.firstChild) {
        cardDeck.removeChild(cardDeck.firstChild);
    }//remove all previous cards

    shuffle(cardSet);
    display(cardSet);
}
//-----------------------------------------------------
function resetCard()
//-----------------------------------------------------
{
//reset card to initial state 
    for (var i = 0; i < arguments.length; i++) 
        arguments[i].className = "card";
    
};

shuffle(cardSet);
display(cardSet);