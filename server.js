//Run update.ps1 to update the file to render and git
const http = require("http");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const app = express();
const fs = require("fs");
const path = require("path");
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
    cheerio.load(fs.readFileSync("E:\NoGuardian\NoGuardian.html"));
    //cheerioHTML("iframe").attr("src", "https://the link");
    //Im gonna inject a script to get a elements and fix them.
    cheerioHTML("head").prepend(`
        <script>
        document.addEventListener("DOMContentLoaded", function() {
            const a = document.querySelectorAll("a");
            a.forEach(link => {
                if (!link.href.includes("https://rendernoguardianproxy-1.onrender.com/api?url=")) {
                    link.href = "https://rendernoguardianproxy-1.onrender.com/api?url=" + link.href; 
                }
            });
            a.addEventListener("click", () => {
                cheerioHTML("iframe").attr("src", href);
            });
        });
        </script>
    `);
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("NoGuardian Proxy is running via Render");
});