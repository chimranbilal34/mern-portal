var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var passport = require('passport')

var users = require('./routes/api/users')
var profile = require('./routes/api/profile')
var posts = require('./routes/api/post')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = require('./config/keys')
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Db connected'))
    .catch(err => console.log(err))

app.use(passport.initialize())
//passport config
require('./config/passport')(passport)

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

app.listen(3000, () => { console.log(`Server listen on port 3000`) })