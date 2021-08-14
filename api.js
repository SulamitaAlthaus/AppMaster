const axios = require("axios");

const api = axios.create({
    baseURL: `https://akabab.github.io/superhero-api/api/`
});

module.exports = api;