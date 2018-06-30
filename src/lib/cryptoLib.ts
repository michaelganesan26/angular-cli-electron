//This is a crypto file


import * as crypto from 'crypto';

//this functions takes a few minutes
function work(limit = 1000) {
    let start = Date.now();
    let n = 0;

    while (n < limit) {

        crypto.randomBytes(2048, (err, buffer) => {

            if (err) {
                throw err;
                //console.log(`Error generating random bytes: ${err}`);

            }

            console.log(`${buffer} bytes of random data: ${buffer.toString('hex')}`);
        });
    }

    return {
        timeElapsed: Date.now() - start
    };
}

module.exports = work;

