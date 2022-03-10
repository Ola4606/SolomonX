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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solomonBot2Part2 = exports.solomonBot2Part1 = void 0;
//
const dotenv_1 = __importDefault(require("dotenv"));
const ccxt_1 = __importDefault(require("ccxt"));
const ws_1 = __importDefault(require("ws"));
//
const usdtmarkets_1 = require("../data/usdtmarkets");
const functions_1 = require("../general/functions");
const timers_1 = require("timers");
//
dotenv_1.default.config();
//
const binanceClient = new ccxt_1.default.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
});
//GENERAL VARIABLES
var totalNumberOfMarketPairs = usdtmarkets_1.marketPairs.length; //number of USDT market pairs avaliable on binance
var totalNumberOfBatches;
var currentBatchBeingProcessed = 1;
//VARIABLES RELATED TO VIOLATILITY TEST 1
var listOfMarketPairsThatPassedTheFirstviolatilityTest = []; //maket pairs that pass the first test will be added here
var signifierForParticularMarketPairBatchInMarketPairViolationTest1 = []; //list that helps me know what market pairs have finished being tested
var marketPairBatchBeingCurrentlyTested = [];
//VARIABLES RELATED TO ULTIMATE VIOLATILITY TEST
var listOfMarketPairsThatPassedTheUltimateViolatilityTest = [];
var signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest = [];
var marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest = [];
var listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest = [];
//
var marketPairBatches = [];
//FUNCTIONS
const calculateTheTotalNumberOfBatches = () => {
    if (totalNumberOfMarketPairs % 100 === 0) { //an exact number of batches
        totalNumberOfBatches = totalNumberOfMarketPairs / 100;
    }
    else {
        totalNumberOfBatches = Math.floor(totalNumberOfMarketPairs / 100) + 1;
    }
    return totalNumberOfBatches;
};
const listOutTheBatches = () => {
    for (var i = 0; i < totalNumberOfBatches; i++) { //
        var listOfMarketPairsForThisBatch = []; //all the markets to be used in this batch
        listOfMarketPairsForThisBatch = usdtmarkets_1.marketPairs.slice((0 + ((currentBatchBeingProcessed - 1) * 100)), (100 + ((currentBatchBeingProcessed - 1) * 100))); //calculating pairs for the batch based on the number of the last batch
        marketPairBatches.push(listOfMarketPairsForThisBatch);
        currentBatchBeingProcessed = currentBatchBeingProcessed + 1; //updating batch number
    }
    console.log('Batched up the market pairs');
};
const getAndStoreBatchData = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b;
    try {
        for (var marketPairBatches_1 = __asyncValues(marketPairBatches), marketPairBatches_1_1; marketPairBatches_1_1 = yield marketPairBatches_1.next(), !marketPairBatches_1_1.done;) {
            const batchData = marketPairBatches_1_1.value;
            //
            var amountOfMarketPairsInThisBatch;
            amountOfMarketPairsInThisBatch = batchData.length; //get the number of match pairs in the current batch
            try {
                for (var batchData_1 = (e_2 = void 0, __asyncValues(batchData)), batchData_1_1; batchData_1_1 = yield batchData_1.next(), !batchData_1_1.done;) {
                    const marketPair = batchData_1_1.value;
                    const marketPairData = yield binanceClient.fetchTicker(marketPair); //getting the JSON data of a specific market pair
                    const marketPairLastPrice = Number(marketPairData['info']['lastPrice']); //getting the price of a specific market pair from the JSON data
                    console.log(`Batch ${marketPairBatches.indexOf(batchData) + 1} | Market Pair ${batchData.indexOf(marketPair) + 1} (${marketPair}) | Market Pair Price: $${marketPairLastPrice}`);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (batchData_1_1 && !batchData_1_1.done && (_b = batchData_1.return)) yield _b.call(batchData_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            console.log('wait start');
            yield (0, functions_1.delayInFunction)(2000); //wait for 2 sec before starting the next batch (so I don't cross the binance API Limit of 1200 request per minute)
            console.log('wait end');
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (marketPairBatches_1_1 && !marketPairBatches_1_1.done && (_a = marketPairBatches_1.return)) yield _a.call(marketPairBatches_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    console.log('Thank GOD. Bot process complete');
});
const connectToWebSocketPriceTickerForASingleMarketPair = (marketPairWsStreamName) => __awaiter(void 0, void 0, void 0, function* () {
    const webSocketUrl = `wss://stream.binance.com:9443/ws/${marketPairWsStreamName}@trade`;
    //VARIABLES
    var listOfPricesInThe5mins = [];
    ////
    console.log(`Starting WebSocket Connection for ${marketPairWsStreamName}`);
    const currentWS = new ws_1.default(webSocketUrl);
    //when the connection is secured
    currentWS.on("open", () => {
        console.log(`Thank GOD, WebSocket for ${marketPairWsStreamName} connected`);
        //set a 5min timeout before running function to disconnect the webSocket 
        (0, timers_1.setTimeout)(() => {
            currentWS.terminate();
        }, 300000);
    });
    //when trade messages are sent
    currentWS.on("message", function incoming(message) {
        const marketPairData = JSON.parse(message);
        listOfPricesInThe5mins.push(Number(marketPairData["p"]));
    });
    //when a ping frame is sent, send back a pong frame to prevent closure of the web socket
    currentWS.on("ping", () => {
        currentWS.pong(); //send pong frame
    });
    //simply restart this function on closure of the web socket
    currentWS.on("close", () => {
        console.log(`WebSocket for ${marketPairWsStreamName} terminated after 5mins | Analysing Prices to determine Violatility`);
        console.log(`Lowest Price: ${Math.min(...listOfPricesInThe5mins)} | Highest Price: ${Math.max(...listOfPricesInThe5mins)}`);
        //perform analysis to see whether it passed the violatility test
        const pricePercentageChange = ((Math.max(...listOfPricesInThe5mins) - Math.min(...listOfPricesInThe5mins)) / Math.min(...listOfPricesInThe5mins)) * 100;
        //save name if passed
        if (pricePercentageChange >= 1.5) {
            if (pricePercentageChange > 3.5) {
                console.log(`${marketPairWsStreamName} is too violatile (could be a short push) | Percentage Change: ${pricePercentageChange}`);
            }
            else { // 1.5 - 3.5
                console.log(`${marketPairWsStreamName} is violatile | Percentage Change: ${pricePercentageChange}`);
                listOfMarketPairsThatPassedTheFirstviolatilityTest.push(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());
            }
        }
        else {
            console.log(`${marketPairWsStreamName} is not violatile | Percentage Change: ${pricePercentageChange}`);
        }
        //signify that you have finished
        const indexOfMarketPair = marketPairBatchBeingCurrentlyTested.indexOf(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());
        if (indexOfMarketPair !== -1) { //the market pair exist in the list.. By GOD's Grace.
            signifierForParticularMarketPairBatchInMarketPairViolationTest1[indexOfMarketPair] = true;
            console.log(signifierForParticularMarketPairBatchInMarketPairViolationTest1);
        }
    });
});
const connectToWebSocketPriceTickerForABatchOfMarketPair = (marketPairWsBatchOfStreamNames) => { var marketPairWsBatchOfStreamNames_1, marketPairWsBatchOfStreamNames_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_3, _a;
    //fill this list($marketPairBatchBeingCurrentlyTested) with the current batch market pairs
    marketPairBatchBeingCurrentlyTested = marketPairWsBatchOfStreamNames;
    //fill this list($signifierForParticularMarketPairBatchInMarketPairViolationTest1) with the corresponding number of falses has the number of pairs in the current batch
    marketPairBatchBeingCurrentlyTested.forEach(() => {
        signifierForParticularMarketPairBatchInMarketPairViolationTest1.push(false);
    });
    //create the Checker BOT, that will check if a Violatie Test 1 is done for a particular batch
    checkerBot(marketPairWsBatchOfStreamNames);
    try {
        for (marketPairWsBatchOfStreamNames_1 = __asyncValues(marketPairWsBatchOfStreamNames); marketPairWsBatchOfStreamNames_1_1 = yield marketPairWsBatchOfStreamNames_1.next(), !marketPairWsBatchOfStreamNames_1_1.done;) {
            const marketPairName = marketPairWsBatchOfStreamNames_1_1.value;
            connectToWebSocketPriceTickerForASingleMarketPair(marketPairName.toLowerCase().replace('/', ''));
            yield (0, functions_1.delayInFunction)(1000);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (marketPairWsBatchOfStreamNames_1_1 && !marketPairWsBatchOfStreamNames_1_1.done && (_a = marketPairWsBatchOfStreamNames_1.return)) yield _a.call(marketPairWsBatchOfStreamNames_1);
        }
        finally { if (e_3) throw e_3.error; }
    }
}); };
//CHECKER BOT
const checkerBot = (currentMarketPairBatch) => {
    //create a setInterval to check every 5mins whether the test for a particular batch is done
    const checkerBotFunction = (0, timers_1.setInterval)(() => {
        if (!signifierForParticularMarketPairBatchInMarketPairViolationTest1.includes(false)) {
            //start the next batch
            if (marketPairBatches[totalNumberOfBatches - 1] === currentMarketPairBatch) { //if this is the last batch that was just checked
                console.log(`CHECKER BOT: Done checking all batches`);
                console.log(listOfMarketPairsThatPassedTheFirstviolatilityTest);
                //refresh
                signifierForParticularMarketPairBatchInMarketPairViolationTest1 = [];
                marketPairBatchBeingCurrentlyTested = [];
                //Ultimate Violatility Test
                solomonBot2Part2(listOfMarketPairsThatPassedTheFirstviolatilityTest);
                listOfMarketPairsThatPassedTheFirstviolatilityTest = []; //refresh
            }
            else { //start the next batch
                //refresh
                signifierForParticularMarketPairBatchInMarketPairViolationTest1 = [];
                marketPairBatchBeingCurrentlyTested = [];
                connectToWebSocketPriceTickerForABatchOfMarketPair(marketPairBatches[marketPairBatches.indexOf(currentMarketPairBatch) + 1]);
                console.log(`CHECKER BOT: Batch ${marketPairBatches.indexOf(currentMarketPairBatch) + 2} started`);
            }
            //cancel this checker bot
            clearInterval(checkerBotFunction);
        }
        else {
            console.log(`Batch ${marketPairBatches.indexOf(currentMarketPairBatch) + 1} not yet finished`);
        }
    }, 60000);
};
// Ultimate Violatility Test
const ultimateViolatilityTest = (batchOfViolatileMarketPairs) => { var batchOfViolatileMarketPairs_1, batchOfViolatileMarketPairs_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_4, _a;
    marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest = batchOfViolatileMarketPairs; //storing the violatile pairs
    try {
        for (batchOfViolatileMarketPairs_1 = __asyncValues(batchOfViolatileMarketPairs); batchOfViolatileMarketPairs_1_1 = yield batchOfViolatileMarketPairs_1.next(), !batchOfViolatileMarketPairs_1_1.done;) {
            const marketPair = batchOfViolatileMarketPairs_1_1.value;
            const marketPairTickerData = yield binanceClient.fetchTicker(marketPair);
            if (Number(marketPairTickerData["info"]["priceChangePercent"]) < 0) { //a loser
                marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.splice(marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.indexOf(marketPair), 1); //remove pair from list
                console.log(`UltimateViolatilityTester: ${marketPair} is a loser and has been removed`);
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (batchOfViolatileMarketPairs_1_1 && !batchOfViolatileMarketPairs_1_1.done && (_a = batchOfViolatileMarketPairs_1.return)) yield _a.call(batchOfViolatileMarketPairs_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    if (marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.length > 0) { //to check if there are still pairs in the list
        //redo the violatility test and start trades
        connectToWebSocketPriceTickerForABatchOfMarketPairForUltimateViolatileTest(marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest);
    }
}); };
const connectToWebSocketPriceTickerForASingleMarketPairForUltimateViolatileTest = (marketPairWsStreamName) => __awaiter(void 0, void 0, void 0, function* () {
    const webSocketUrl = `wss://stream.binance.com:9443/ws/${marketPairWsStreamName}@trade`;
    //VARIABLES
    var listOfPricesInThe5mins = [];
    ////
    console.log(`Starting WebSocket Connection for ${marketPairWsStreamName}`);
    const currentWS = new ws_1.default(webSocketUrl);
    //when the connection is secured
    currentWS.on("open", () => {
        console.log(`Thank GOD, WebSocket for ${marketPairWsStreamName} connected`);
        //set a 5min timeout before running function to disconnect the webSocket 
        (0, timers_1.setTimeout)(() => {
            currentWS.terminate();
        }, 900000);
    });
    //when trade messages are sent
    currentWS.on("message", function incoming(message) {
        const marketPairData = JSON.parse(message);
        listOfPricesInThe5mins.push(Number(marketPairData["p"]));
    });
    //when a ping frame is sent, send back a pong frame to prevent closure of the web socket
    currentWS.on("ping", () => {
        currentWS.pong(); //send pong frame
    });
    //simply restart this function on closure of the web socket
    currentWS.on("close", () => {
        console.log(`WebSocket for ${marketPairWsStreamName} terminated after 15mins | Analysing Prices to determine Violatility`);
        console.log(`Lowest Price: ${Math.min(...listOfPricesInThe5mins)} | Highest Price: ${Math.max(...listOfPricesInThe5mins)}`);
        //perform analysis to see whether it passed the violatility test
        const pricePercentageChange = ((Math.max(...listOfPricesInThe5mins) - Math.min(...listOfPricesInThe5mins)) / Math.min(...listOfPricesInThe5mins)) * 100;
        //save name if passed
        if (pricePercentageChange >= 1.5) {
            if (pricePercentageChange > 5) { // too violatile, I feel its a short push
                console.log(`${marketPairWsStreamName} is too violatile (having a short push) | Percentage Change: ${pricePercentageChange}`);
            }
            else { // 1.5 - 5
                console.log(`${marketPairWsStreamName} is violatile | Percentage Change: ${pricePercentageChange}`);
                listOfMarketPairsThatPassedTheUltimateViolatilityTest.push(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());
                listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest.push(`${marketPairWsStreamName} | Percentage Change: ${pricePercentageChange}`);
            }
        }
        else {
            console.log(`${marketPairWsStreamName} is not violatile anymore | Percentage Change: ${pricePercentageChange}`);
        }
        //signify that you have finished
        const indexOfMarketPair = marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.indexOf(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());
        if (indexOfMarketPair !== -1) { //the market pair exist in the list.. By GOD's Grace.
            signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest[indexOfMarketPair] = true;
            console.log(signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest);
        }
    });
});
const connectToWebSocketPriceTickerForABatchOfMarketPairForUltimateViolatileTest = (marketPairWsBatchOfStreamNames) => { var marketPairWsBatchOfStreamNames_2, marketPairWsBatchOfStreamNames_2_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_5, _a;
    //fill this list($signifierForParticularMarketPairBatchInMarketPairViolationTest1) with the corresponding number of falses has the number of pairs in the current batch
    marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.forEach(() => {
        signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest.push(false);
    });
    //create the Checker BOT, that will check if a Ultimate Violatie Test is done for a particular batch
    checkerBotForUltimateViolatileTest(marketPairWsBatchOfStreamNames);
    try {
        for (marketPairWsBatchOfStreamNames_2 = __asyncValues(marketPairWsBatchOfStreamNames); marketPairWsBatchOfStreamNames_2_1 = yield marketPairWsBatchOfStreamNames_2.next(), !marketPairWsBatchOfStreamNames_2_1.done;) {
            const marketPairName = marketPairWsBatchOfStreamNames_2_1.value;
            connectToWebSocketPriceTickerForASingleMarketPairForUltimateViolatileTest(marketPairName.toLowerCase().replace('/', ''));
            yield (0, functions_1.delayInFunction)(1000);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (marketPairWsBatchOfStreamNames_2_1 && !marketPairWsBatchOfStreamNames_2_1.done && (_a = marketPairWsBatchOfStreamNames_2.return)) yield _a.call(marketPairWsBatchOfStreamNames_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
}); };
//CHECKER BOT
const checkerBotForUltimateViolatileTest = (currentMarketPairBatch) => {
    //create a setInterval to check every 15mins whether the test for a particular batch is done
    const checkerBotFunction = (0, timers_1.setInterval)(() => {
        if (!signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest.includes(false)) {
            console.log(`CHECKER BOT: Done checking all batches for Ultimate Violatility Test`);
            console.log(listOfMarketPairsThatPassedTheUltimateViolatilityTest);
            console.log(listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest);
            //refresh
            signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest = [];
            marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest = [];
            //start trades
            //cancel this checker bot
            clearInterval(checkerBotFunction);
        }
        else {
            console.log(`Ultimate Violatility Test not yet finished`);
        }
    }, 60000);
};
//////////
const solomonBot2Part1 = () => {
    calculateTheTotalNumberOfBatches();
    listOutTheBatches();
    connectToWebSocketPriceTickerForABatchOfMarketPair(marketPairBatches[0]);
};
exports.solomonBot2Part1 = solomonBot2Part1;
const solomonBot2Part2 = (batchOfViolatileMarketPairs) => {
    if (batchOfViolatileMarketPairs.length >= 1) { //there are actually violatilty market pairs
        //run the UltimateViolatileTest to check 2 things:
        //i) That they are still violatile
        //ii) That the violatility is positive
        ultimateViolatilityTest(batchOfViolatileMarketPairs);
    }
    else {
        console.log('No Violatile Market Pair, so starting again');
        solomonBot2Part1();
    }
};
exports.solomonBot2Part2 = solomonBot2Part2;
