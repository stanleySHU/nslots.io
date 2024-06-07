var fs = require('fs');



let files = (fs.readdirSync("."));


let str = "";

for (let i = 0; i < files.length; i++) {
    let filename = files[i];

    if (filename.endsWith('.json')) {
        let obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
        str += filename + "\n";

        let content = "0123456789,.";
        for (let key in obj) {
            if(key.indexOf('err_')===-1)
                content += obj[key] + obj[key].toLowerCase() + obj[key].toUpperCase();
        }
        str += noDups(content).replace(' ','');
        str += "\n\n";
    }
}



function noDups(s) {
    var chars = {}, rv = '';

    for (var i = 0; i < s.length; ++i) {
        if (!(s[i] in chars)) {
            chars[s[i]] = 1;
            rv += s[i];
        }
    }

    return rv;
}

fs.writeFile("result.txt", str, function (err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});