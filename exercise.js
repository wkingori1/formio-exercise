const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const fetch = require('node-fetch');

const port = 3000;

// Body Parser for Forms
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/import', async (req, res) => {
    let body = {"data":{"firstName":"TestFirst","lastName":"TestLast","email":"trenthill@example.com","submit":true},"state":"submitted"};
    const firstName = body.data.firstName;
    let request = null;


    for (let i = 0; i < 5; i++) {
        let newFirstName = firstName + i;
        body.data.firstName = newFirstName;
        
        // assign current Promise to request
        request = (makeFetch('http://localhost:3001/form/5f9d9667001e7eadfd4ec1df/submission?live=1', req, body));

        // force loop execution to pause until request has been resolve
        await request.then((data) => {
            console.log(data);
        });
    }

    // complete all promise in sequence
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

// return a Promise for our fetch operations
function makeFetch(url, req, body) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', 'x-jwt-token': req.headers['x-jwt-token'] },
        }).then((data) => {
            resolve(data);
        });
    });
}