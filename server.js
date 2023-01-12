const express = require('express')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use (express.urlencoded({ extended: true }))

app.use(express.static('public'))

const notes = require('./db/db.json')


app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`)
    console.log(`${req.method} request made to get the notes.html page`)
})

app.get('/api/notes', (req, res) => {
    res.status(200).json(notes)
    console.log(`${req.method} request made to get the notes file`)
})

app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
    console.log(`${req.method} request made to get the index.html page`)
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(newNote)
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
                (writeErr) => writeErr ? console.error(writeErr) : console.info ('Successfully added note to notes!'))
            }
        })
        const response = {
            status: 'success',
            body: newNote,
        }
        console.log(response)
        res.status(201).json(response)
    } else {
        res.status(500).json('Error adding note')
    }
})










app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`))