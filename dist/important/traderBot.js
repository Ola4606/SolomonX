"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderBotPart1 = void 0;
const ccxt_1 = __importDefault(require("ccxt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var currentMarketPair = "";
var priceOfMarketPair = 0;
var baseBalanceBeforeTrade = 0;
var baseBalanceAfterTrade = 0;
//this is being counted so I can restart the process if the buy order hasn't be reached after 3 loops of 1min5secs
var timesBuyOrderTryHasRun = -1;
const binanceClient = new ccxt_1.default.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
});
// const marketName = "BTC/USDT";
// const assetName = "BTC";
// const baseName = "USDT";
//
var lastBuyOrder = undefined;
var lastSellOrder = undefined;
//
var tradeStartTime;
var tradeEndTime;
//to determine where the bot stopped before the crash or restart
// const determineWhatToDo = async () => {
//   console.log('DETERMINER: Running');
//   //determine what to do based on order open
//   //i) check if any orders are open
//   const currentlyOpenTrades = await binanceClient.fetchOpenOrders(marketName);
//   if (currentlyOpenTrades.length !== 0) {
//    // IF AN ORDER IS OPEN
//    console.log('DETERMINER: Order(s) open');
//    //check what type of order it is
//    const orderType = currentlyOpenTrades[0].side;
//    if(orderType === "buy") {
//    console.log('DETERMINER: Order open is BUY');
//    // IF THE ORDER OPEN IS A BUY ORDER
//    //i) cancel the order
//    await binanceClient.cancelOrder(currentlyOpenTrades[0].id, marketName);
//    console.log('DETERMINER: Cancelled the BUY Order');
//    //ii) check that no orders are open
//    console.log('DETERMINER: Rechecking to see if orders are open');
//    const currentlyOpenTrades2 = await binanceClient.fetchOpenOrders(marketName);
//    if (currentlyOpenTrades2.length === 0) {
//      //a) if none is start trading bot one
//      console.log('DETERMINER: Thank GOD, no orders are open | Starting Trading Bot 1');
//      TraderBotPart1();
//    } else{
//      //b) else restart determiner
//      console.log('DETERMINER: Order(s) still open | Restarting Determiner function to see whats up');
//      determineWhatToDo();
//    }
//    } else {
//    // ELSE IF THE ORDER OPEN IS A SELL ORDER
//    //i) initiate the selling main drive bot with the current order id
//    lastSellOrder = currentlyOpenTrades[0] //IMPORTANT so the code knows the order details
//    baseBalanceBeforeTrade = currentlyOpenTrades[0].cost;
//    confirmSellOrderCompletionMainDrive();
//    }
//   } else {
//     // ELSE IF NO ORDER IS OPEN
//     // i) start trading bot 1
//     console.log('DETERMINER: No order is open');
//     //CHECK TO SEE IF I HAVE ENOUGH USDT TO START A TRADE
//     console.log('DETERMINER: Checking to see if I have enough usdt to start a trade');
//     const base = await binanceClient.fetchBalance();
//     const baseBalance = base.free[baseName];
//     const baseBalanceTrun = toTrun(baseBalance, 4);
//     if (Number(baseBalanceTrun) > 10) {
//       //IF I HAVE ENOUGH, START THE DEFAULT PROCESS
//       console.log('DETERMINER: Have more than 10USDT hence starting the TradingBot1');
//       TraderBotPart1();
//     } else {
//       //ELSE IF I DON'T HAVE ENOUGH, START A SELL ORDER FOR THE CURRENT COIN I AM TRADING
//       console.log('DETERMINER: Before starting sell order I need to get the price I bought at and use that to calculate sell price | Getting last buy price');
//       const lastBuyTrade = await binanceClient.fetchMyTrades(marketName, undefined, 1);
//       console.log(`Last buy price was ${lastBuyTrade[0]['info']['price']}`);
//       console.log('DETERMINER: Setting priceOfMarketPair');
//       priceOfMarketPair = Number(lastBuyTrade[0]['info']['price']) + ((Number(lastBuyTrade[0]['info']['price']) * 0.15) / 100);
//       console.log('DETERMINER: Running TradingBot2 to start a sell order for the coin I am holding');
//       TraderBotPart2();
//     }
//   }
// }
//
const TraderBotPart1 = (marketPair) => __awaiter(void 0, void 0, void 0, function* () {
    currentMarketPair = marketPair;
    yield getCurrentPriceOfMarketPair(); // getting current price of the selected market pair
    console.log("Gotten Price");
    yield cancelAllLiveTrades(); // cancelling all open trades
    console.log("Cancelled all live trades");
    lastBuyOrder = yield creatingBuyOrder(); // creating a buy order
    tradeStartTime = new Date();
    console.log("Created buy order");
    confirmBuyOrderCompletionMainDrive(); //wait for buyOrder fill
});
exports.TraderBotPart1 = TraderBotPart1;
//
const TraderBotPart2 = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Buy order completed. Thank GOD");
    lastSellOrder = yield creatingSellOrder(); // creating a sell order
    console.log("Createed sell order");
    confirmSellOrderCompletionMainDrive(); // wait for sell order to fill
});
//subFunctions
const getCurrentPriceOfMarketPair = () => __awaiter(void 0, void 0, void 0, function* () {
    const tickerPrice = yield binanceClient.fetchTicker(currentMarketPair); // getting general data on this market pair
    priceOfMarketPair = Number(tickerPrice["info"]["lastPrice"]); // price of this market pair
});
//get prices from the binanceWebsocket
// const compileItemPricesOverThePast1Min = () => {
//   console.log("Starting WebSocket connection");
//   const ws = new webSocket.WebSocket('wss://bstream.binance.com:9443/stream?streams=abnormaltradingnotices');
//   //when the connection is secured
//   ws.on("open", () => {
//     console.log("Thank GOD, websocket connected");
//   });
//   //when trade messages are sent
//   ws.on("message", function incoming(message) {
//     const tradeData = JSON.parse(message);
//     console.log(tradeData);
//   });
//   //when a ping frame is sent, send back a pong frame to prevent closure of the web socket
//   ws.on("ping", () => {
//     ws.pong(); //send pong frame
//   });
//   //simply restart this function on closure of the web socket
//   ws.on("close", () => {
//     compileItemPricesOverThePast1Min();
//   });
// };
//
// const getAveragePriceOfCoinOverThePastMin = () => {
//     setTimeout(() => {
//      console.log(pricesOverThePast1Min.length);
//      //add up all prices in the list
//      const sum = pricesOverThePast1Min.reduce((a,b)=>a+b);
//      //get the average of all prices in the list
//      priceOfMarketPair = sum / pricesOverThePast1Min.length;
//      //empty the list to have a clean slate on restart
//      pricesOverThePast1Min = [];
//      console.log(priceOfMarketPair);
//      //re run this function
//      getAveragePriceOfCoinOverThePastMin();
//     }, 60000);
//  };
//
const cancelAllLiveTrades = () => __awaiter(void 0, void 0, void 0, function* () {
    const openOrders = yield binanceClient.fetchOpenOrders(currentMarketPair); // fetching all live trade orders
    for (const order of openOrders) { // cancel each one
        yield binanceClient.cancelOrder(order.id, currentMarketPair);
    }
});
const creatingBuyOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    //getting how much of the base coin I actually have
    const base = yield binanceClient.fetchBalance();
    const baseBalance = base.free["USDT"];
    const baseBalanceTrun = toTrun(baseBalance, 4);
    //just noting down how much is to be spent, so I can calculate profit later on
    baseBalanceBeforeTrade = Number(baseBalance);
    //create a buy order for marketPair at 0.2% lower than the current price
    const buyingPrice = priceOfMarketPair -
        (priceOfMarketPair * 0.2) / 100;
    var buyingPriceTrun = toTrun(buyingPrice, 4);
    if (buyingPriceTrun === 0) {
        buyingPriceTrun = buyingPrice;
    }
    const buyingVolume = baseBalanceTrun / priceOfMarketPair;
    console.log(`Creating buy order at a price of ${buyingPriceTrun}`);
    const createdBuyOrder = yield binanceClient.createLimitBuyOrder(//creating the buy Order
    currentMarketPair, Number(buyingVolume), Number(buyingPriceTrun));
    return createdBuyOrder;
});
const confirmBuyOrderCompletion = function () {
    return __awaiter(this, void 0, void 0, function* () {
        timesBuyOrderTryHasRun = timesBuyOrderTryHasRun + 1; //counting buyOrder
        console.log(`this buyOrder has run: ${timesBuyOrderTryHasRun}`);
        console.log("Confirming buy order complete");
        // fetching all live trade orders
        const allLiveTrades = yield binanceClient.fetchOpenOrders(currentMarketPair);
        if (allLiveTrades.some((tradeOrder) => tradeOrder.id === lastBuyOrder.id)) { //this means that the order has not gone through so the code needs to keep waiting
            if (timesBuyOrderTryHasRun === 3) {
                console.log("Buy order has run for 60secs and is not yet complete, so the process will be cancelled and restarted");
                return false;
            }
            else {
                console.log("Buy order not yet complete will try again in 20secs");
                return true;
            }
        }
        else {
            return false;
        }
    });
};
const confirmBuyOrderCompletionMainDrive = function () {
    return __awaiter(this, void 0, void 0, function* () {
        waitfor(confirmBuyOrderCompletion, false, 20000, 0, "Thank GOD", function () {
            return __awaiter(this, void 0, void 0, function* () {
                //false can be returned for 2 reason
                // i) If the buy order has actually gone through
                // ii) or If the thing is just taking to much time
                if (timesBuyOrderTryHasRun === 3) {
                    timesBuyOrderTryHasRun = -1; //to restart count
                    console.log("Count has been restarted");
                    console.log("Restarting process.. Cancelling trades and re-ordering a buyOrder");
                    yield cancelAllLiveTrades();
                    //at this point just to be sure that the buy order didn't complete yet.. check the amount of USDT avalible
                    const base = yield binanceClient.fetchBalance();
                    const baseBalance = base.free["USDT"];
                    const baseBalanceTrun = toTrun(baseBalance, 4);
                    if (Number(baseBalanceTrun) > 10) {
                        //the buyOrder was not complete
                        TraderBotPart1(currentMarketPair);
                    }
                    else {
                        console.log("Thank GOD, buy order completed");
                        timesBuyOrderTryHasRun = -1;
                        TraderBotPart2(); //start the sell phase
                    }
                }
                else {
                    console.log("Thank GOD, buy order completed");
                    timesBuyOrderTryHasRun = -1;
                    TraderBotPart2(); //start the sell phase
                }
            });
        });
    });
};
const creatingSellOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating the sell order");
    //getting how much of the base coin I actually have
    const asset = yield binanceClient.fetchBalance();
    const assetBalance = asset.free[currentMarketPair.replace('/USDT', '')];
    // const assetBalanceTrun = toTrun(assetBalance, 4);
    //create sell order for btc at 0.2% greater than the buy order price
    const sellingPrice = priceOfMarketPair +
        (priceOfMarketPair * 0.2) / 100;
    var sellingPriceTrun = toTrun(sellingPrice, 4);
    if (sellingPriceTrun === 0) {
        sellingPriceTrun = sellingPrice;
    }
    const createdSellOrder = yield binanceClient.createLimitSellOrder(currentMarketPair, Number(assetBalance), Number(sellingPriceTrun));
    console.log(`Created the sell order and would be selling at a price of ${sellingPrice}`);
    // documentSellOrder(createdSellOrder);
    return createdSellOrder;
});
// function that will check every Imin5secs whether the sell Order has gone through
const confirmSellOrderCompletion = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Confirming sell order");
        // fetching all live trade orders
        const allLiveTrades = yield binanceClient.fetchOpenOrders(currentMarketPair);
        if (allLiveTrades.some((tradeOrder) => tradeOrder.id === lastSellOrder.id)) {
            //this means that the order has not gone through so the code needs to keep waiting
            console.log("Sell Order not yet complete, trying again in 20s");
            return true;
        }
        else {
            return false;
        }
    });
};
const confirmSellOrderCompletionMainDrive = function () {
    return __awaiter(this, void 0, void 0, function* () {
        waitfor(confirmSellOrderCompletion, false, 20000, 0, "Thank GOD", function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Sell order complete. Thank GOD");
                tradeEndTime = new Date();
                // 1) share profit
                //calculate profit from amount now in balance
                const base = yield binanceClient.fetchBalance();
                baseBalanceAfterTrade = base.free["USDT"];
                const profitInUSDT = Number(baseBalanceAfterTrade) - Number(baseBalanceBeforeTrade);
                console.log(`Total profit made from this full trade execution is ${profitInUSDT} in ${Math.abs((tradeEndTime.getTime() - tradeStartTime.getTime()) / 1000)} secs`);
                // console.log(`Storing in Ethereum ${profitInUSDT/2}, by buying instanly at market price`);
                // //share profit into 2 equal halves (one half goes back in USDT (base) and the other half in BTC (store of profit))
                // await binanceClient.createMarketOrder("USDT/BTC", "sell", profitInUSDT/2);
                // documentCompletedSellOrder(lastSellOrder, profitInUSDT);
                // sendEmailToOla(
                //  lastSellOrder,
                //  profitInUSDT,
                //  );
                // 2) restart trading bot after 5 mins
                //   setTimeout(() => {
                //     TraderBotPart1();
                //   }, 900000);
            });
        });
    });
};
// const sendEmailToOla = (order, profit) => {
//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "olaoluwaadeyemo01@gmail.com",
//       pass: "Ola4realz..#4606#nigeria",
//     },
//   });
//   var mailOptions = {
//     from: "olaoluwaadeyemo01@gmail.com",
//     to: "olaoluwaadeyemo7@gmail.com",
//     subject: "Thank GOD. SolomonX executed another profitable trade",
//     text: `
//     Thank GOD. Sell order completed sucessfully.
//     Order Details =>
//     Order ID: ${order.id}
//     Order Market: ${order.symbol}
//     Profit made: $${String(profit)}
//     `,
//   };
//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// };
//**********************************************************************
// function waitfor - Wait until a condition is met
//
// Needed parameters:
//    test: function that returns a value
//    expectedValue: the value of the test function we are waiting for
//    msec: delay between the calls to test
//    callback: function to execute when the condition is met
// Parameters for debugging:
//    count: used to count the loops
//    source: a string to specify an ID, a message, etc
//**********************************************************************
function waitfor(test, expectedValue, msec, count, source, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if condition met. If not, re-check later (msec).
        while ((yield test()) !== expectedValue) {
            count++;
            setTimeout(function () {
                waitfor(test, expectedValue, msec, count, source, callback);
            }, msec);
            return;
        }
        // Condition finally met. callback() can be executed.
        console.log(source +
            ": " +
            "Buy order completed/restarted after " +
            count +
            " multiplied by 1min5secs");
        callback();
    });
}
//funtion to truncate decimal numbers with rounding them
function toTrun(num, fixed) {
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
}
