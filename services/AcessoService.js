const axios = require('axios')
const qs = require('querystring')
const fs = require('fs')
const path = require('path')
const jwtService = require('./JwtService')
const redisService = require('./RedisService')

async function auth() {
    let options = {
        serviceAccount: process.env.SERVICE_ACCOUNT,
        tenant: process.env.TENANT,
        basePath: process.env.IDENTITY_URL
    }

    let cache = await redisService.get(options.serviceAccount);
    if(cache)
        return cache;

    const requestBody = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtService.createServiceAccountToken(options)
    }

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    try {
        let result = await axios.post(`${options.basePath}/oauth2/token`, qs.stringify(requestBody), config);
        redisService.set(options.serviceAccount,result.data, result.data.expires_in)
        return result.data;

    } catch (err) {
        console.log(err)
    }

}

async function envelope({
    accessToken,
    filePath,
    name,
    cpf
}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
        }
    }

    const requestBody = {
        "EnvelopeFlow": [{
            "ID_Flow": 1
        }, {
            "ID_Flow": 3
        }],
        "Documents": [{
            "EmitterUserName": "Samir",
            "EmitterUserEmail": "samirvarandas@gmail.com",
            "DocumentType": "Teste Documento Samir",
            "FileBase64": fs.readFileSync(path.resolve(filePath), {
                encoding: 'base64'
            }),
            "UnitUUID": "",
            "Subscribers": [{
                "SubscriberName": name,
                "SubscriberCPF": cpf,
                "SubscriberEmail": "samirvarandas@gmail.com",
                "SubscriberPhone": "5511981452487",
                "AuthCode": "q12we34r"
            }]
        }]
    }

    try {
        let result = await axios.post(`${process.env.ACESSO_SERVICE_API_URL}/envelope`, requestBody, config);
        return result.data;

    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    auth,
    envelope
}