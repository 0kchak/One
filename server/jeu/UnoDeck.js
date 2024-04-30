const Card = require ("./Card");
const Player = require("./Player");
//const ManageGame = require("./ManageGame");

/**
 * Module exports an UnoDeck class representing the deck of Uno cards.
 * @class
 */
module.exports = class UnoDeck {
    /**
     * Constructor for the UnoDeck class.
     * Initializes and shuffles the Uno deck.
     * @constructor
     */
    constructor() {
        this.cards = this.generateCards();
        this.shuffle();
    }

    /**
     * Generates a standard Uno deck with colors and values.
     * @returns {Array} - An array of Card instances representing the Uno deck.
     */
    generateCards() {
        const cards = [];
        const colors = ['bleu', 'violet', 'rose', 'vert'];
        const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+2', '+4', 'reverse', 'skip', 'changeColor'];

        colors.forEach((color) => {
            values.forEach((value) => {
                // Exclude colors for special cards
                if (value === 'changeColor' ) {                
                    cards.push(new Card("allColors", value));
                } else if(value === '+4') {
                    cards.push(new Card("withoutColor", value));
                } else {
                    cards.push(new Card(color, value));
                    // Duplicate cards for values other than '0', '+4', and 'changeColor'
                    if (value !== '0') {
                        cards.push(new Card(color, value));
                    }
                }
            });
        });

        return cards;
    }

    /**
     * Shuffles the cards in the Uno deck using the Fisher-Yates algorithm.
     */
    shuffle() {
        // Loop through the array of cards in reverse order
        for (let i = this.cards.length - 1; i > 0; i--) {
            // Generate a random index between 0 and the current index
            let j = Math.floor(Math.random() * (i + 1));

            // Swap the current card with the randomly selected card
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * Draws a card from the Uno deck.
     * @returns {Card|null} - The drawn card if the deck is not empty, or null if the deck is empty.
     */
    DrawCard() {
        // Check if the deck is empty
        if (this.cards.length === 0) {
            console.log("Deck is empty");
            return null;
        } else {
            // Pop and return the top card from the deck
            return this.cards.pop();
        }
    }

    /**
     * Deals a specified number of cards to each player or a specific player.
     * This function can be used at the start of the game, where all players receive the same number of cards.
     * Additionally, it can be used for a specific player when he pioshe card(s) from the deck.
     * @param {Array} players - An array of Player instances to whom the cards will be dealt.
     * @param {number} numCards - The number of cards to deal to each player.
    */
    dealCards(players, numCards) {
        // Loop through the number of cards to be dealt
        for (let i = 0; i < numCards; i++) {
            // Iterate through each player
            players.forEach((player) => {
                // Draw a card from the Uno deck
                let card = this.DrawCard();
    
                // If the deck is not empty, add the drawn card to the player's hand
                if (card) {
                    player.addToHand(card);
                } else {
                    let index;
                    this.generateCards();
                    this.shuffle();
                    if(ManageGame.lastCard.isChangeColorCard) {
                        index = this.cards.findIndex(card => card.isChangeColorCard());
                    } else {
                        index = this.cards.findIndex(card => card.color === ManageGame.lastCard.color && card.value === ManageGame.lastCard.value);
                    }
                    if (index !== -1) {
                        this.cards.splice(index, 1);
                    }
                    card = this.DrawCard();
                    player.addToHand(card);
                }
            });
        }
    }


   

}