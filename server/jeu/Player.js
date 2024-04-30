/**
 * Module exports a Player class representing a player in the Uno game.
 * @class
 */
module.exports = class Player {

    /**
     * Static property to keep track of the last assigned player ID.
     * @type {number}
     */
    static lastId = 0;

    /**
     * Constructor for the Player class.
     * @constructor
     * @param {string} name - The name of the player.
     */
    constructor(name) {
        this.id = Player.lastId++;
        this.name = name;
        this.hand = [];
        this.nextPlayer = null;
        this.previousPlayer = null;
    }

    /**
     * Gets the player's ID.
     * @returns {number} - The player's ID.
     */
    getPlayerId() {
        return this.id;
    }

    /**
     * Gets the player's name.
     * @returns {string} - The player's name.
     */
    getPlayerName() {
        return this.name;
    }

    /**
     * Gets the player's hand.
     * @returns {Array} - An array of Card instances representing the player's hand.
     */
    getPlayerHand() {
        return this.hand;
    }

     /**
     * Initializes the player's hand by resetting it to an empty array.
     */
     initializeHand() {
        this.hand = [];
    }

    /**
     * Adds a card to the player's hand.
     * @param {Card} card - The card to add to the player's hand.
     */
    addToHand(card) {
        this.hand.push(card);
    }

    /**
     * Removes a specified card from the player's hand.
     * @param {Card} card - The card to be removed from the player's hand.
     */
    removeFromHand(card) {
        // Find the index of the card in the player's hand
        const indexOfCard = this.hand.findIndex(handCard => handCard.color === card.color && handCard.value === card.value);

        // If the card exists in the player's hand, remove it
        if (indexOfCard !== -1) {
            this.hand.splice(indexOfCard, 1);
        }
    }
}

