const delayInFunction = (timeInMs: number) => new Promise(res => setTimeout(res, timeInMs)); //a function to cause awaitable delays in functions
    

export { delayInFunction };