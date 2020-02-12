const allWeather = [
    'rainy',
    'sunny',
    'clear',
    'icy',
    'wet'
];

module.exports = function () {
    const state = {
        weather: allWeather[Math.round(Math.random() * (allWeather.length - 1))],
        tags: new Set()
    };

    return {
        setName,
        getName,
        getWeather,
        addTag,
        hasTag,
        removeTag
    };

    function setName(name) {
        state.name = name;
    }

    function getName() {
        return state.name;
    }

    function getWeather() {
        return state.weather;
    }

    function addTag(name) {
        state.tags.add(name);
    }

    function hasTag(name) {
        return state.tags.has(name);
    }

    function removeTag(name) {
        return state.tags.delete(name);
    }
};