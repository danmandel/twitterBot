const misc = {};
module.exports = misc;

misc.getRandomElement = arr => {
    const element = arr[Math.floor(Math.random()*arr.length)];
    return element;
}
