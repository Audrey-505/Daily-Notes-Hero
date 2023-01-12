const express = require('express')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use (express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`)
    console.log(`${req.method} request made to get the notes.html page`)
})











app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`))