const https = require('https');
const jsdom = require('jsdom');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('url.txt')
});

rl.on('line', (line) => {
    if (line) {
        https.get(line.toString().trim(), res => {
            let data = [];
            res.on('data', chunk => {
                data.push(chunk);
            });
            res.on('end', () => {
                const dom = new jsdom.JSDOM(Buffer.concat(data).toString());
                const $ = require('jquery')(dom.window);
                $('script').filter(function () {
                    if ($(this).attr('src')) {
                        console.log(line+" : ", $(this).attr('src'));
                    }
                })
            });
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }
});

