const express = require('express')
const session = require('express-session')
const app = express()
const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({posts: {}}).write() //Create a database

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

var data = db.get('posts').find({name: 'Henderson Briggs'}).value() //it only works with one user for now

app.get('/', (req, res) => { //store the information for the user to see
    res.render('index.ejs', {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        company: data.company,
        age: data.age,
        eyecolor: data.eyecolor,
        balance: data.balance,
        })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', (req, res) => {
    if (data.email == req.body.email && data.password == req.body.password){ //check to see if the password and username are the same
        res.redirect('/')
    } else {
        res.send('Wrong username or password')
    }
})

app.get('/edit', (req, res) => {
    res.render('register.ejs')
})

app.post('/edit', async (req, res) => {
    try {
        db.get('posts').remove().write()
        db.get('posts')
            .push({ name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    address: req.body.address,
                    company: req.body.company,
                    age: req.body.company,
                    eyecolor: req.body.eyecolor,
                    balance: req.body.balance,
            }).write()
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.listen(5000)
