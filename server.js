const { read } = require('fs');
const http = require('http');
const users = require("./db.json");

const server = http.createServer( (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if(req.method === "GET"){
        if(req.url === "/"){
            res.write("Welcome to Home Page")
            res.end()
        }
        else if(req.url === "/users"){
            res.end(JSON.stringify(users))
        }      
    }

    else if(req.method === "POST"){
        
        let body = ''
        if(req.url === "/users"){
            req.on('data', (data) => {
                body += data;
              });
            
              req.on('end', () => {
                let parsed;
            
                try {
                  parsed = JSON.parse(body);
                } catch (e) {
                  res.statusCode = 400;
                  res.end('{"error":"CANNOT_PARSE"}');
                }
                users.push(parsed)
            
                res.end(JSON.stringify(parsed));
              })
        }
    }

    else if(req.method === "PATCH"){
        if(req.url === "/user"){
            let body = '';
            req.on('data', data => {
                body += data
            })

            req.on('end', () => {
                let parsed;

                try{
                    parsed = JSON.parse(body)
                }
                catch (e) {
                    res.statusCode = 400;
                    res.end('{"error":"CANNOT_PARSE"}');
                  }

                let user = users.find( (user) => user.id == parsed.id)
                console.log(user);
                user.first_name = parsed.first_name
                res.end(JSON.stringify(user));
            })
        }
    }

    else if(req.method === "DELETE"){
        if(req.url === '/user'){
            let body = '';
            req.on('data', data => {
                body += data
            })

            req.on('end', () => {
                let parsed;

                try{
                    parsed = JSON.parse(body)
                }
                catch (e) {
                    res.statusCode = 400;
                    res.end('{"error":"CANNOT_PARSE"}');
                  }

                let newUser = users.filter( (user) => user.id != parsed.id)
                res.end(JSON.stringify(newUser));
            })
        }
    }

})

server.listen(8000, () => {
    console.log("started")
})