const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const PRIVATE_KEY = "bvfkdsbkjfsndfowenfonmsfbhew";

// parse application/json
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const auth = (req, res, next) => {
    // console.log(req.cookies?.access_token);
    try {
        const token = req.cookies?.access_token;
        const user = jwt.verify(token, PRIVATE_KEY)
        if (user) {
            // console.log(user)
            delete user.iat;
            delete user.exp;
            req.user = user;
            return next();
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        res.redirect('/login')
    }

}
app.get('/', auth, (req, res) => {
    console.log(req.user);
    res.render('home', { user: req.user })
})

const users = [
    { id: 237, name: "Sarah", lName: 'Conor', age: 30, password: "$2b$10$p52suWSS7xIxD7UPEaf.I.tXcN8vPwabnwxW2DjQUaz43DyKVIAHa" },
    { name: "Jhon", password: "blablablabl" }]

app.get('/login', (req, res) => {
    res.render('login')
})


app.post('/login', async (req, res) => {
    const password = req.body.password;
    const name = req.body.name;
    const user = users.find(user => user.name === name);
    if (user) {
        const isAllowed = await bcrypt.compare(password, user.password)
        if (isAllowed) {
            // sign with RSA SHA256
            const userCopy = {...user}
            delete userCopy.password;

            const token = jwt.sign(userCopy, PRIVATE_KEY , {expiresIn : '15s'});
            // console.log(token)
            res.cookie('access_token', token, {
                sameSite: 'strict',
                httpOnly: 'true',
                // secure: process.env.prod
            }).redirect('/');
        } else {
            res.send("Not allowed")
        }
        //here we should compare password with our hashed passowrd
    } else {
        res.send('not found').status(404)
    }

})

app.post('/signup', async (req, res) => {
    // console.log(req.body)
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    res.send(hashedPassword)
})



app.listen(PORT, () => {
    console.log('App is listening on port ', PORT)
})





