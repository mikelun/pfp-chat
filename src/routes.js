const path = require('path')
const express = require('express')
var cors = require('cors');

module.exports = (app) => {

    // use it before all route definitions
    app.use(express.static(path.join(__dirname, '..','dist')))
    app.use(express.static(path.join(__dirname, '..','node_modules')))
    app.get('/', (req, res) => {
        console.log("ASD");
        res.sendFile(path.join(__dirname, '..','dist','index.html'))
    });
}