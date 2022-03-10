var amount: number = 10;

var numberOfDays: number = 30;

var mainFunction: Function = () => {
  for (var i = 0; i < numberOfDays; i++) {
    var amountIncrease: number = 0.15 * amount;

    amount = amount + amountIncrease;
  }

  console.log(`$${amount.toFixed(2)} in ${numberOfDays} day(s)`);
};

mainFunction();
