const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;


// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('ok')
})

const users = [
    { name: "Sarah", password: "$2b$10$p52suWSS7xIxD7UPEaf.I.tXcN8vPwabnwxW2DjQUaz43DyKVIAHa" },
    { name: "Jhon", password: "blablablabl" }]

app.post('/login', async (req, res) => {
    const password = req.body.password;
    const name = req.body.name;
    const user = users.find(user => user.name === name);
    console.log(user)
    if (user) {
        const isAllowed = await bcrypt.compare(password, user.password)
        if (isAllowed) {
            res.send(user);
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





