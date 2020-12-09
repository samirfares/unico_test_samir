
//Simple redis caching system with get/set methods.
const Redis = require("ioredis");
const redis = new Redis();

//retrieve data on redis by key
async function get(key) {
    return new Promise((resolve, reject) => {
        redis.get(key, function (err, result) {
            if (err) {
                reject(err)
            } else {
                //parse back to JSON
                resolve(JSON.parse(result))
            }
        });
    })

}

//stores key/value in redis with an given expiration time in seconds.
async function set(key, value, ex = 3600) {
    //save values in String format
    redis.set(key, JSON.stringify(value), 'EX', ex);
}

module.exports = {
    get,
    set
}