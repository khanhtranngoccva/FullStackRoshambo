const http = require('http');
const fs = require('fs')
const url = require('url');
const querystring = require('querystring');
const figlet = require("figlet");
const path = require("path");

const CHOICE_ENCODING = {
    scissors: 0,
    rock: 1,
    paper: 2,
}
const choiceEncodingReverse = {};
for (let key of Object.keys(CHOICE_ENCODING)) {
    choiceEncodingReverse[CHOICE_ENCODING[key]] = key;
}

const server = http.createServer((req, res) => {
    const page = url.parse(req.url).pathname;
    const params = querystring.parse(url.parse(req.url).query);
    if (page === '/') {
        fs.readFile('index.html', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (page == '/api') {
        if ('choice' in params) {
            const numberOfChoicesAvailable = Object.keys(CHOICE_ENCODING).length;
            const playerChoice = CHOICE_ENCODING[params.choice];
            const rockPaperScissors = _ => {
                return Math.floor(Math.random() * 3);
            };
            const cpuChoice = rockPaperScissors();
            let result = {success: true, cpuChoice: choiceEncodingReverse[cpuChoice]};
            if (playerChoice > cpuChoice || (playerChoice === 0 && cpuChoice === numberOfChoicesAvailable - 1)) {
                result.winner = "player";
            } else if (playerChoice < cpuChoice || (cpuChoice === 0 && playerChoice === numberOfChoicesAvailable - 1)) {
                result.winner = "cpu";
            } else {
                result.winner = "tie";
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        }
    } else if (page == '/css/style.css') {
        fs.readFile('css/style.css', function (err, data) {
            res.write(data);
            res.end();
        });
    } else if (page == '/js/main.js') {
        fs.readFile('js/main.js', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.write(data);
            res.end();
        });
    } else if (path.extname(page) === ".png") {
        fs.readFile(path.join(__dirname, page), function (err, data) {
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.write(data);
            res.end();
        });
    } else {
        figlet('404!!', function (err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            res.write(data);
            res.end();
        });
    }
});

server.listen(8000);
