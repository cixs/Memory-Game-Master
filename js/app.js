/*
 * Create a list that holds all of your cards
 */
var cards = [   
"anchor",
"bicycle",
"bolt",
"bomb",
"cube",
"diamond",
"leaf",
"paper-plane-o"];//eigth cards array

var cardList = createArray(cards);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

 //****************** Shuffle function from http://stackoverflow.com/a/2450976********************************

function shuffle(array) {

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

//**************** function to create the initial array of cards ************************************

function createArray(array)
{
    var retArray = [];           //array to be returned
    for(let i = 0; i < 2; i++)   //every card appears twice on deck
    { array.forEach(element => {
        retArray.push(element);
        });
    }
    return retArray;
};

//**************** set up the event listener for a card **********************************************

document.addEventListener("click", function(event)
{
    if (event.target.className.toLowerCase() === "card")  
        displayCardOpen(event.target);   
});

//**************** compare an opening card with the one previously opened ************

function compareCards(card)
{

}

//************************* display the card's symbol ************************************************

function displayCardOpen(card){
    card.classList.add("open");
    card.classList.add("show");
    card.style.cssText = "box-shadow: initial;"; //avoid keeping box-shadow as it was modified 
}                                            //by mouseover event listener


//************************* display the cards on the page *******************************************

function display(array){

    var currentIndex = array.length;
    var cardDeck = document.getElementById("cards-board");

    while (cardDeck.firstChild) {
        cardDeck.removeChild(cardDeck.firstChild);
    }//remove all previous cards (necessary when 'restart' was clicked)

    while (currentIndex !== 0) {
        var node = document.createElement("li"); 
        var card = document.createElement("i");
        node.classList.add("card");
        card.classList = ("fa " + "fa-" + array[currentIndex-1]);
        node.appendChild(card);
        cardDeck.appendChild(node);
        currentIndex -= 1;
    }
}
//************ change the card's box-shadow when mouse pointer is hovering **************************
//not in project requirements, but just for fun

document.addEventListener("mouseover", function(event)
{
    if (event.target.className.toLowerCase() === "card") 
        event.target.style.cssText = "box-shadow: 5px 5px 20px 0 rgba(255, 255, 0, 0.5);";
});

//*************** revert the card's box-shadow when mouse pointer is leaving **************************

document.addEventListener("mouseout", function(event)
{
    if (event.target.className.toLowerCase() === "card") 
        event.target.style.cssText = "box-shadow: initial;";
});

shuffle(cardList);
display(cardList);