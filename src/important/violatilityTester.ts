//
import dotenv from "dotenv";
import ccxt from "ccxt";
import WebSocket from 'ws';

//
import { marketPairs } from "../data/usdtmarkets";
import { delayInFunction } from "../general/functions";
import { setInterval, setTimeout } from "timers";


//
dotenv.config();

//
const binanceClient = new ccxt.binance({ // binance Client created using the Solomon Bot Binance Api Keys
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET,
});

//GENERAL VARIABLES
var totalNumberOfMarketPairs: number = marketPairs.length; //number of USDT market pairs avaliable on binance
var totalNumberOfBatches: number;
var currentBatchBeingProcessed: number = 1;

//VARIABLES RELATED TO VIOLATILITY TEST 1
var listOfMarketPairsThatPassedTheFirstviolatilityTest: string[] = []; //maket pairs that pass the first test will be added here
var signifierForParticularMarketPairBatchInMarketPairViolationTest1: boolean[] = []; //list that helps me know what market pairs have finished being tested
var marketPairBatchBeingCurrentlyTested: string[] = [];

//VARIABLES RELATED TO ULTIMATE VIOLATILITY TEST
var listOfMarketPairsThatPassedTheUltimateViolatilityTest: string[] = []; 
var signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest: boolean[] = []; 
var marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest: string[] = [];

var listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest: string[] = [];

//
var marketPairBatches: any[] = [];


//FUNCTIONS



const calculateTheTotalNumberOfBatches: Function = () : number => { // theAim: The aim of this function is to calculate how many times the data retrival function will run based on the number of times ten can go into the $totalNumberOfMarketPairs
 
    if(totalNumberOfMarketPairs%100 === 0) { //an exact number of batches
        totalNumberOfBatches = totalNumberOfMarketPairs/100;
    } else{
        totalNumberOfBatches = Math.floor(totalNumberOfMarketPairs/100) + 1;
    }

    

    return totalNumberOfBatches;

}; 

const listOutTheBatches: Function = () => {

    for(var i = 0; i < totalNumberOfBatches; i++) { //

        var listOfMarketPairsForThisBatch: string[] = []; //all the markets to be used in this batch
        listOfMarketPairsForThisBatch = marketPairs.slice((0 + ((currentBatchBeingProcessed - 1) * 100)), (100 + ((currentBatchBeingProcessed - 1) * 100))); //calculating pairs for the batch based on the number of the last batch
        
        marketPairBatches.push(listOfMarketPairsForThisBatch);

        currentBatchBeingProcessed = currentBatchBeingProcessed + 1; //updating batch number

    }
    
    console.log('Batched up the market pairs');

};



const getAndStoreBatchData: Function = async () => { // theAim: 

   for await (const batchData of marketPairBatches) {
     
     //
     var amountOfMarketPairsInThisBatch: number;

     amountOfMarketPairsInThisBatch = batchData.length //get the number of match pairs in the current batch

     for await (const marketPair of batchData) {

        
            const marketPairData = await binanceClient.fetchTicker(marketPair); //getting the JSON data of a specific market pair

            const marketPairLastPrice = Number(marketPairData['info']['lastPrice']); //getting the price of a specific market pair from the JSON data

            console.log(`Batch ${marketPairBatches.indexOf(batchData) + 1} | Market Pair ${batchData.indexOf(marketPair) + 1} (${marketPair}) | Market Pair Price: $${marketPairLastPrice}`);

     }

     console.log('wait start');
     await delayInFunction(2000); //wait for 2 sec before starting the next batch (so I don't cross the binance API Limit of 1200 request per minute)
     console.log('wait end');


   }

    

    

    console.log('Thank GOD. Bot process complete');

};



const connectToWebSocketPriceTickerForASingleMarketPair: Function = async ( marketPairWsStreamName: string ) => {

  const webSocketUrl: string = `wss://stream.binance.com:9443/ws/${marketPairWsStreamName}@trade`;

  //VARIABLES
  var listOfPricesInThe5mins: number[] = [];

  ////



  console.log(`Starting WebSocket Connection for ${marketPairWsStreamName}`);
  
  
  const currentWS = new WebSocket(webSocketUrl);

  //when the connection is secured
  currentWS.on("open", () => {
    console.log(`Thank GOD, WebSocket for ${marketPairWsStreamName} connected`);

    //set a 5min timeout before running function to disconnect the webSocket 
    setTimeout(() => {
        currentWS.terminate();
    }, 300000);
  });

  //when trade messages are sent
  currentWS.on("message", function incoming(message: any) {
    const marketPairData: any = JSON.parse(message);
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
   if(pricePercentageChange >= 1.5) {

    if(pricePercentageChange > 3.5) {

      console.log(`${marketPairWsStreamName} is too violatile (could be a short push) | Percentage Change: ${pricePercentageChange}`);

    } else{ // 1.5 - 3.5

      console.log(`${marketPairWsStreamName} is violatile | Percentage Change: ${pricePercentageChange}`);
      listOfMarketPairsThatPassedTheFirstviolatilityTest.push(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());

    }
       
   } else{
       console.log(`${marketPairWsStreamName} is not violatile | Percentage Change: ${pricePercentageChange}`);
   }
   
   //signify that you have finished
   const indexOfMarketPair: number = marketPairBatchBeingCurrentlyTested.indexOf(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase()); 
   if(indexOfMarketPair !== -1) { //the market pair exist in the list.. By GOD's Grace.
     signifierForParticularMarketPairBatchInMarketPairViolationTest1[indexOfMarketPair] = true;
     console.log(signifierForParticularMarketPairBatchInMarketPairViolationTest1);
   }
   
 });

}; 

const connectToWebSocketPriceTickerForABatchOfMarketPair: Function = async ( marketPairWsBatchOfStreamNames: string[] ) => {

 //fill this list($marketPairBatchBeingCurrentlyTested) with the current batch market pairs
 marketPairBatchBeingCurrentlyTested = marketPairWsBatchOfStreamNames;

 //fill this list($signifierForParticularMarketPairBatchInMarketPairViolationTest1) with the corresponding number of falses has the number of pairs in the current batch
 marketPairBatchBeingCurrentlyTested.forEach(() => {
    signifierForParticularMarketPairBatchInMarketPairViolationTest1.push(false);
 });


 //create the Checker BOT, that will check if a Violatie Test 1 is done for a particular batch
 checkerBot(marketPairWsBatchOfStreamNames);

 for await (const marketPairName of marketPairWsBatchOfStreamNames) { //start the $connectToWebSocketPriceTickerForASingleMarketPair function for each pair in this batch
   connectToWebSocketPriceTickerForASingleMarketPair(marketPairName.toLowerCase().replace('/', ''));
   await delayInFunction(1000);
 }


};




//CHECKER BOT
const checkerBot: Function = (currentMarketPairBatch: string[]) => {

  //create a setInterval to check every 5mins whether the test for a particular batch is done

  const checkerBotFunction = setInterval(() => {

    if(!signifierForParticularMarketPairBatchInMarketPairViolationTest1.includes(false)) {
      
      //start the next batch
      if(marketPairBatches[totalNumberOfBatches - 1] === currentMarketPairBatch) { //if this is the last batch that was just checked

        console.log(`CHECKER BOT: Done checking all batches`);
        console.log(listOfMarketPairsThatPassedTheFirstviolatilityTest);
        
        //refresh
        signifierForParticularMarketPairBatchInMarketPairViolationTest1 = [];
        marketPairBatchBeingCurrentlyTested = [];

        //Ultimate Violatility Test
        solomonBot2Part2(listOfMarketPairsThatPassedTheFirstviolatilityTest);

        listOfMarketPairsThatPassedTheFirstviolatilityTest = []; //refresh

      } else{ //start the next batch
      
      //refresh
      signifierForParticularMarketPairBatchInMarketPairViolationTest1 = [];
      marketPairBatchBeingCurrentlyTested = [];

      connectToWebSocketPriceTickerForABatchOfMarketPair(marketPairBatches[marketPairBatches.indexOf(currentMarketPairBatch) + 1]);
      console.log(`CHECKER BOT: Batch ${marketPairBatches.indexOf(currentMarketPairBatch) + 2} started`);

      }
      

      //cancel this checker bot
      clearInterval(checkerBotFunction);
      
    } else{
      console.log(`Batch ${marketPairBatches.indexOf(currentMarketPairBatch) + 1} not yet finished`);
    }

  }, 60000);

};



// Ultimate Violatility Test
const ultimateViolatilityTest: Function = async (batchOfViolatileMarketPairs: string[]) => {

  marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest = batchOfViolatileMarketPairs; //storing the violatile pairs

  for await (const marketPair of batchOfViolatileMarketPairs) {

    const marketPairTickerData = await binanceClient.fetchTicker(marketPair);

    if(Number(marketPairTickerData["info"]["priceChangePercent"]) < 0) { //a loser

      marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.splice(marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.indexOf(marketPair), 1); //remove pair from list
      console.log(`UltimateViolatilityTester: ${marketPair} is a loser and has been removed`);
    } 

  }

  if(marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.length > 0) { //to check if there are still pairs in the list

    //redo the violatility test and start trades
    connectToWebSocketPriceTickerForABatchOfMarketPairForUltimateViolatileTest(marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest);

  }


};






const connectToWebSocketPriceTickerForASingleMarketPairForUltimateViolatileTest: Function = async ( marketPairWsStreamName: string ) => {

  const webSocketUrl: string = `wss://stream.binance.com:9443/ws/${marketPairWsStreamName}@trade`;

  //VARIABLES
  var listOfPricesInThe5mins: number[] = [];

  ////



  console.log(`Starting WebSocket Connection for ${marketPairWsStreamName}`);
  
  
  const currentWS = new WebSocket(webSocketUrl);

  //when the connection is secured
  currentWS.on("open", () => {
    console.log(`Thank GOD, WebSocket for ${marketPairWsStreamName} connected`);

    //set a 5min timeout before running function to disconnect the webSocket 
    setTimeout(() => {
        currentWS.terminate();
    }, 900000);
  });

  //when trade messages are sent
  currentWS.on("message", function incoming(message: any) {
    const marketPairData: any = JSON.parse(message);
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
   if(pricePercentageChange >= 1.5) {

    
      console.log(`${marketPairWsStreamName} is violatile | Percentage Change: ${pricePercentageChange}`);
      listOfMarketPairsThatPassedTheUltimateViolatilityTest.push(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase());
      listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest.push(`${marketPairWsStreamName} | Percentage Change: ${pricePercentageChange}`);

    

   } else{
       console.log(`${marketPairWsStreamName} is not violatile anymore | Percentage Change: ${pricePercentageChange}`);
   }
   
   //signify that you have finished
   const indexOfMarketPair: number = marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.indexOf(marketPairWsStreamName.replace('usdt', '/usdt').toUpperCase()); 
   if(indexOfMarketPair !== -1) { //the market pair exist in the list.. By GOD's Grace.
     signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest[indexOfMarketPair] = true;
     console.log(signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest);
   }
   
 });

}; 

const connectToWebSocketPriceTickerForABatchOfMarketPairForUltimateViolatileTest: Function = async ( marketPairWsBatchOfStreamNames: string[] ) => {


 //fill this list($signifierForParticularMarketPairBatchInMarketPairViolationTest1) with the corresponding number of falses has the number of pairs in the current batch
 marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest.forEach(() => {
    signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest.push(false);
 });


 //create the Checker BOT, that will check if a Ultimate Violatie Test is done for a particular batch
 checkerBotForUltimateViolatileTest(marketPairWsBatchOfStreamNames);

 for await (const marketPairName of marketPairWsBatchOfStreamNames) { //start the $ connectToWebSocketPriceTickerForASingleMarketPairForUltimateViolatileTest function for each pair in this batch
  connectToWebSocketPriceTickerForASingleMarketPairForUltimateViolatileTest(marketPairName.toLowerCase().replace('/', ''));
   await delayInFunction(1000);
 }


};





//CHECKER BOT
const checkerBotForUltimateViolatileTest: Function = (currentMarketPairBatch: string[]) => {

 //create a setInterval to check every 15mins whether the test for a particular batch is done

 const checkerBotFunction = setInterval(() => {

   if(!signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest.includes(false)) {
     

       console.log(`CHECKER BOT: Done checking all batches for Ultimate Violatility Test`);
       console.log(listOfMarketPairsThatPassedTheUltimateViolatilityTest);
       console.log(listOfMarketPairsPercentagesThatPassedTheUltimateViolatilityTest);
       
       //refresh
       signifierForParticularMarketPairBatchInMarketPairUltimateViolatilityTest = [];
       marketPairBatchBeingCurrentlyTestedForTheUltimateViolatilityTest = [];


       //start trades

     
     

     //cancel this checker bot
     clearInterval(checkerBotFunction);
     
   } else{
     console.log(`Ultimate Violatility Test not yet finished`);
   }

 }, 60000);

};




//////////


const solomonBot2Part1: Function = () => {

calculateTheTotalNumberOfBatches();

listOutTheBatches();

connectToWebSocketPriceTickerForABatchOfMarketPair(marketPairBatches[0]);

};




const solomonBot2Part2: Function = (batchOfViolatileMarketPairs: string[]) => {

  if(batchOfViolatileMarketPairs.length >= 1) { //there are actually violatilty market pairs

    //run the UltimateViolatileTest to check 2 things:

    //i) That they are still violatile
    //ii) That the violatility is positive
    ultimateViolatilityTest(batchOfViolatileMarketPairs);

  } else{
    
    console.log('No Violatile Market Pair, so starting again');
    solomonBot2Part1();


  }

};

export { solomonBot2Part1, solomonBot2Part2 }



