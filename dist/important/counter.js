"use strict";
var amount = 10;
var numberOfDays = 30;
var mainFunction = () => {
    for (var i = 0; i < numberOfDays; i++) {
        var amountIncrease = 0.15 * amount;
        amount = amount + amountIncrease;
    }
    console.log(`$${amount.toFixed(2)} in ${numberOfDays} day(s)`);
};
mainFunction();
