require('dotenv').config()
const AcessoService = require('./services/AcessoService');

// grab the packages we need
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 80;


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

app.get('/api/health', function (req, res) {
    res.status(200).json({
        status: 200,
        message: "Server Healthy"
    });
});

app.post('/api/envelope', async function (req, res) {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let document = req.files.document;
            let body = req.body;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
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