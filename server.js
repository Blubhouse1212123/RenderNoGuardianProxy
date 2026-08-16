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
            res.removeHeader("Server");
            res.removeHeader("Transfer-Encoding");
            res.removeHeader("X-Powered-By");
            res.send(proxied);
        }
    });
});
function proxy(html, url) {
    var cheerioHTML = cheerio.load(html);
    //Rewrite all A elements so it redirects HREFs through the proxy.
    cheerioHTML("a").each(function(index, element) {
        //Current Element is the current one we are working with
        //Original href is the original href of the current element
        const currentElement = cheerioHTML(this);
        const originalhref = currentElement.attr("href");
        //If the originalhref of the current element doesnt include the proxy url, then fix the href.
        if (!originalhref === undefined) {
            if (!originalhref.includes("https://rendernoguardianproxy-1.onrender.com/api?url=")) {
                currentElement.attr("href", "https://rendernoguardianproxy-1.onrender.com/api?url=" + originalhref);               
            }
        }
    });
    //Prepend the injected script to the HEAD element of the HTML
    cheerioHTML("head").prepend(`
        <script>
        </script>
    `);
    return cheerioHTML.html();

}