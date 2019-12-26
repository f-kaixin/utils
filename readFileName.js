let fs = require('fs');

const files = fs.readdirSync('./json');

files.map(file => {
    console.log(file.replace('.json', ''));
})