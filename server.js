const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const spotifyWebApi = require('spotify-web-api-node');
const CLIENT_SECRET = require('./secrets')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req, res) => {
    let refreshToken = req.body.refreshToken
    console.log('hi')
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'ae000aeb821a408ca0727034b1683518',
        clientSecret: CLIENT_SECRET,
        refreshToken,
    })

    spotifyApi.refreshAccessToken().then(data => {
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn,
        })
    }).catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})


app.post('/login', (req, res) => {
    let code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'ae000aeb821a408ca0727034b1683518',
        clientSecret: CLIENT_SECRET
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
});

app.get("/lyrics", async (req, res) => {
    const lyrics =
      (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
    res.json({ lyrics })
})

app.listen(3001)