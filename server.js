//Run update.ps1 to update the file to render and git
const http = require("http");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const PORT = process.env.PORT || 3000;
const PROXYPATH = "/proxy";
app.use("/api", router);
//This is the main function for GET requests.
router.get("/", function(req, res) {
    //This is the url we want to go to, such as example.com
    //we have to stick thus
    const url = req.query.url;
    const page = request.get(url, function(error, response, body) {
        if (!error) {
            const proxied = proxy(body, url);
            //Removing headers so we dont get issues of refusal.
            res.removeHeader("X-Frame-Options");
            res.removeHeader("Content-Security-Policy");
            res.removeHeader("Access-Control-Allow-Origin");
            res.send(proxied);
        }
    });
});
function proxy(html, url) {
    var cheerioHTML = cheerio.load(html);
    //Prepend the injected script to the HEAD element of the HTML
    cheerioHTML("head").prepend(`
        <script>
        alert("JS is injected");
        headers: {
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0";
        }
        </script>
    `);
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("Proxy Running");
});