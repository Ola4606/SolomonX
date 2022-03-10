"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayInFunction = void 0;
const delayInFunction = (timeInMs) => new Promise(res => setTimeout(res, timeInMs)); //a function to cause awaitable delays in functions
exports.delayInFunction = delayInFunction;
