
var crypto = require('crypto');

//this functions takes a few minutes
function work(limit) {
    let start = Date.now();
    let n = 0;
    throw {"Error":"Wow this sucks"};
    console.log('I am in ',limit);
    while (n < limit) {
        crypto.randomBytes(2048, (err, buffer) => {
            if (err) {
                throw err;
                //console.log(`Error generating random bytes: ${err}`);
            }
            console.log(`${buffer} bytes of random data: ${buffer.toString('hex')}`);
        });
        n++;
    }
    return {
        timeElapsed: Date.now() - start
    };
}
module.exports = work;