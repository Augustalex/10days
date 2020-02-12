const { wait } = require("./common.js");

module.exports = function () {

    const randomSequence = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
    let randomNumberIndex = 0

    return {
        line: (...args) => console.log(...args),
        text: text => process.stdout.write(text),
        breakLine: () => console.log(),
        type: (firstArg, ...rest) => type(firstArg, true, ...rest),
        typeContinously: (firstArg, ...rest) => type(firstArg, false, ...rest),
        clear: () => console.clear()
    };

    async function type(text, breakLine = true, totalTime = 1500) {
        let chars = text.split('')
        let individualTime = totalTime / chars.length;
        for (let char of chars) {
            process.stdout.write(char);
            await wait(getRandomNumber(individualTime))
        }

        if (breakLine) {
            process.stdout.write('\n');
        }
    }

    function getRandomNumber(max) {
        if (randomNumberIndex >= randomSequence.length) {
            randomNumberIndex = 0
        }
        return randomSequence[randomNumberIndex++] * max; //todo index++?
    }
};