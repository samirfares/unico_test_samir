const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')


// Generate JWT Token
function createServiceAccountToken({
    tenant,
    serviceAccount,
    basePath,
    expiresIn = 60*60,//1 hour in seconds 
}) {
    let privateKey = fs.readFileSync(path.resolve(`credentials/${serviceAccount}.key.pem`))
    let payload = {
        iss: `${serviceAccount}@${tenant}.iam.acesso.io`,
        aud: basePath,
        scope: '*',
        exp: Math.floor(Date.now() / 1000) + expiresIn,
        iat: Math.floor(Date.now() / 1000)
    }

    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256'
    })
}


module.exports = {
    createServiceAccountToken
}