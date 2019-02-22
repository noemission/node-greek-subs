const stringSimilarity = require('string-similarity');

module.exports = (target, data) => {

    const { ratings } = stringSimilarity.findBestMatch(
        target,
        data.map(x => x.text)
    );

    return data.map(item => {
        const { rating } = ratings.find(r => r.target === item.text)
        return {
            ...item,
            rating
        }
    }).sort((a, b) => b.rating - a.rating)
}