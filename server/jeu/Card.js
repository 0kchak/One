/**
 * Module exports a Card class representing a playing card.
 * @class
 */
module.exports = class Card {
    /**
     * Constructor for the Card class.
     * @constructor
     * @param {string} color - The color of the card.
     * @param {string} value - The value of the card.
     */
    constructor(color, value) {
        this.color = color;
        this.value = value;
    }

    /**
     * Gets the value of the card.
     * @returns {string} - The value of the card.
     */
    getValue() {
        return this.value;
    }

    /**
     * Gets the color of the card.
     * @returns {string} - The color of the card.
     */
    getColor() {
        return this.color;
    }

    /**
     * Checks if the card is a Skip card.
     * @returns {boolean} - True if the card is a Skip card, false otherwise.
     */
    isSkipCard() {
        return this.value === 'skip';
    }

    /**
     * Checks if the card is a Reverse card.
     * @returns {boolean} - True if the card is a Reverse card, false otherwise.
     */
    isReverseCard() {
        return this.value === 'reverse';
    }

    /**
     * Checks if the card is a Change Color card.
     * @returns {boolean} - True if the card is a Change Color card, false otherwise.
     */
    isChangeColorCard() {
        return this.value === 'changeColor';
    }

    /**
     * Checks if the card is a Plus 2 card.
     * @returns {boolean} - True if the card is a Plus 2 card, false otherwise.
     */
    isPlus2Card() {
        return this.value === '+2';
    }

    /**
     * Checks if the card is a Plus 4 card.
     * @returns {boolean} - True if the card is a Plus 4 card, false otherwise.
     */
    isPlus4Card() {
        return this.value === '+4';
    }

    /**
     * Checks if the card is a special card (Plus 2, Plus 4, Reverse, Skip, Change Color).
     * @returns {boolean} - True if the card is a special card, false otherwise.
     */
    isSpecialCard() {
        return this.isPlus2Card() || this.isPlus4Card() || this.isReverseCard() || this.isSkipCard() || this.isChangeColorCard();
    }
};