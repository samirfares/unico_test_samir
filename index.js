require('dotenv').config()
const AcessoService = require('./services/AcessoService');

// grab the packages we need
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 8080;


// enable files upload
app.use(fileUpload({
    createParentPath: true
}));


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


// routes will go here

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);


/*
   Check the server health, return status 200 if API is running
*/
app.get('/api/health', function (req, res) {
    res.status(200).json({
        status: 200,
        message: "Server Healthy"
    });
});

/*


Create an envelope on Acesso API.
{
    document: [File] required,
    name: String required, name of the document subscriber
    cpf: String required, cpf of the document subscriber
}

*/
app.post('/api/envelope', async function (req, res) {
    try {
        if (!req.files) {
            res.json({
                status: 500,
                message: 'No file uploaded'
            });
        } else {
            let document = req.files.document;
            let body = req.body;

            if(!body.name || !body.cpf){
                res.json({
                    status: 500,
                    message: 'Name and cpf are required fields'
                });
            }
            //move file to documents folder
            document.mv('./documents/' + document.name);

            let auth = await AcessoService.auth();
            let result = await AcessoService.envelope({
                accessToken: auth.access_token,
                filePath: `./documents/${document.name}`,
                name: body.name,
                cpf: body.cpf
            })

            res.status(200).json({
                status: 200,
                message: "Envelope Sent",
                result: result
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});