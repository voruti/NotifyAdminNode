const http = require('http');
const url = require('url');
const admin = require("firebase-admin");


// Firebase:
admin.initializeApp();


// HTTP server:
const server = http.createServer();
server.on('request', async (request, response) => {
    try {
        const queryObject = url.parse(request.url, true).query;

        const secretRaw = queryObject["secret"];
        const tokenRaw = queryObject["token"];
        const titleRaw = queryObject["title"];
        const bodyRaw = queryObject["body"];

        const secret = Array.isArray(secretRaw) ? secretRaw[0] : secretRaw;
        const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;
        let title = Array.isArray(titleRaw) ? titleRaw[0] : titleRaw;
        let body = Array.isArray(bodyRaw) ? bodyRaw[0] : bodyRaw;

        if (process.env.SECRET && !secret) {
            throw new Error("Missing secret");
        }
        if (process.env.SECRET && secret !== process.env.SECRET) {
            throw new Error("Wrong secret");
        }
        if (!token) {
            throw new Error("Missing token");
        }
        if (!title) {
            console.log("Using default title");
            title = "From NotifyAdminNode";
        }
        if (!body) {
            console.log("Using default body");
            body = "" + new Date().toTimeString();
        }

        const message = {
            notification: { title: title, body: body },
            token: token
        };

        admin.messaging()
            .send(message)
            .then(() => {
                console.log("Successfully sent message");
                response.setHeader("Content-Type", "text/html");
                response.end("OK");
            })
            .catch((error) => {
                console.log("Error sending message:", error);
                response.setHeader("Content-Type", "text/html");
                response.end("Error");
            });

    } catch (error) {
        console.error(error);
        response.setHeader("Content-Type", "text/html");
        response.end("Error");
    };
});

server.listen(8099);
console.log("Server started");
