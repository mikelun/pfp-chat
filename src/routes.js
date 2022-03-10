const path = require('path')
const express = require('express')
var cors = require('cors');

module.exports = (app) => {

    // use it before all route definitions
    app.use(express.static(path.join(__dirname, '..','public')))
    app.use(express.static(path.join(__dirname, '..','node_modules')))
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..','public','index.html'))
    });
}