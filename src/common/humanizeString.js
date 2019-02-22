module.exports = (property) => {
    property = property.slice(property.lastIndexOf('=') + 1);
    return property.slice(property.lastIndexOf('/') + 1)
        .replace(/_|\./g, ' ')
        .replace(/(\w+)/g, function (match) {
            return match.charAt(0).toUpperCase() + match.slice(1);
        })
        .replace(/\s{2,}/g, ' ');
};