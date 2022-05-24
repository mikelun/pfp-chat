const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const session = require('express-session');

const fetchCrossorigin = async (req, res) => {
    try {
        let { uri } = req.query

        uri = url.parse(uri)

        // from node_modules/request/request.js:273:31
        if (!(uri.host || (uri.hostname && uri.port)) && !uri.isUnix) {
            return res.json({
                error: 'no url provided'
            })
        }

        console.log('uri', uri.href)

        const metadata = await fetch(uri).then(r => r.json())

        return res.json(metadata)
    } catch (err) {
        res.json({ error: err.message })
    }

}


module.exports = (app) => {
    app.set('trust proxy', 1) // trust first proxy
    app.use(session({
        secret: 'ssshhhhh',
        resave: false,
        saveUninitialized: true
    }));


    app.get('/metadata', fetchCrossorigin)

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
    });

    // // get parametres after / 
    app.use(express.static(path.join(__dirname, '..', 'dist')))

    app.get('/:room', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
    })

    // use it before all route definitions
    //app.set('trust proxy', 1) // trust first proxy


}
