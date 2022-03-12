const http = require('http')
const fs = require('fs') // to read file
http.createServer((req, res) => {
    if(req.url == '/') {
        fs.readFile("./signup.html", "UTF-8", function(err, html){
            res.writeHeader(200, {"Content-Type": "text/html"})
            res.write(html)
            res.end()
        })
    } else if(req.url.match("\.css$")) { // using regex to find css extension
        fs.readFile("./style.css", "UTF-8", function(err, css){ // here we know only 1 css so doing like this but in case of multi files do like js, line 18
            res.writeHeader(200, {"Content-Type": "text/css"})
            res.write(css)
            res.end()
        })
    } else if(req.url.match("\.js$")) {
        fs.readFile('.'+req.url, "UTF-8", function(err, js){ // because it accepts something like ./try.js but req.url is /try.js so added .
            res.writeHeader(200, {"Content-Type": "text/js"})
            if(req.url !== '/server.js') // if its server file then skip this
                res.write(js)
            res.end()
        })
    } else if(req.url === '/data') {
        if(req.method === 'POST') {
            let writeStream = fs.createWriteStream(__dirname+'/data.txt')
            req.pipe(writeStream)
            // let body = ''
            // req.on('data', chunk => {
            //     body += chunk
            // })
            // req.on('end', function() {
            //     try {
            //         // body = JSON.parse(body); as it is already string no need to parse just append it in file
            //         //writeFile(body) // to add new record
            //         console.log(body)
            //         res.end()
            //     } catch (er) { // uh oh! bad json!
            //         res.statusCode = 400
            //         return res.end(`error: ${er.message}`)
            //     }
            // })
        } else if(req.method === 'GET') {
            const stream = fs.createReadStream(__dirname + '/data.txt')
            stream.pipe(res)
            console.log('done streams')
        }
    }
}).listen(3000, () => {
    console.log('running at http://localhost:3000')
})

// // Function to read file
// function readFile() {
//     fs.readFile(file, (exists) => {
//         if(exists) {
//             // fs.readFile(file, 'utf8', (err, data) => {
//             //     if(err) throw err
//             //     let dat = data.toString()
//             //     data = JSON.parse(dat || '[]')
//             //     return data
//             // })
//             return 
//         } else { // no such file
//             return []
//         }
//     })
// }

// Function to write file
// function writeFile(data) { // not working
//     fs.appendFile(file, JSON.stringify(data), 'utf8', function(err) {
//         if (err) throw err;
//         console.log('Saved.');
//     });
// }

/*  // stream
    fs.readFile(__dirname + '/data.txt', (err, data) => {
        res.end(data) // data coming in hexadecimal so do data.toString('utf8')
    })
*/

/* // not working Streams:
    const stream = fs.createReadStream(__dirname + '/data.txt')
    stream.pipe(res)
*/