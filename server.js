//Run update.ps1 to update the file to render and git
//TODO: I have un needed npm installs i need to rid of.
//NPM Installed Packages
//Everything else here is express app setup, you can find references for this in Cheerio Documentation
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
//Incoming GET requests from the URL
router.get("/", function(req, res) {
    //This is the url we want to go to, such as example.com
    //we have to stick thus
    const url = req.query.url;
    const page = request.get(url, function(error, response, body) {
        if (!error) {
            const proxied = proxy(body, url);
            //Maybe i would do it here maybe idk
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
    //I have to do it from here because the SOP, also referred to as the CIA is preventing me from doing it.
    //https://cheerio.js.org/docs/basics/selecting/ CIA Doesnt know what hit them
    //You have to do each not forEach like this, you cant use forEach on a const, must do cheerioHTML
    //Learned that with a quick google AI overview search.
    const hrefArray = [];
    cheerioHTML("a").each((index, element) => {
        //The href of every individual element this thing loops through
        var trueHref = cheerioHTML(element).attr("href");
        hrefArray.push(trueHref);
    });
    cheerioHTML("head").prepend(`
       <script>
        </script>
    `);
    //Element is provided as an arg.
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("NoGuardian Proxy is running via Render");
});