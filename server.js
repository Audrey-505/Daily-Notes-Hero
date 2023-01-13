const express = require('express')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 3001

const { v4: uuidv4 } = require('uuid');

app.use(express.json())
app.use (express.urlencoded({ extended: true }))

app.use(express.static('public'))


app.get('/notes', (req, res) => {
    res.sendFile(`${__dirname}/public/notes.html`)
    console.log(`${req.method} request made to get the notes.html page`)
})

app.get('/api/notes', (req, res) => {
    //res.status(200).json(notes)
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data)
            res.status(200).json(parsedNotes)
        }
    })
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
            text,
            id: uuidv4()
        }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err)
            } else {
                const parsedNotes = JSON.parse(data)
                parsedNotes.push(newNote)
                fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 2),
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

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const parsedIdNotes = JSON.parse(data)
        const result = parsedIdNotes.filter((note) => note.id !== noteId)
        fs.writeFile('./db/db.json', JSON.stringify(result, null, 2),
            (writeErr) => writeErr ? console.error(writeErr) : console.info ('successfully deleted'))
        console.log(result)
        res.json(result)
    })
})










app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`))