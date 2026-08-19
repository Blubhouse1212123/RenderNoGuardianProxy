//*******************************************************
/////////////////////////////////////////////////////////
//BACKEND CODE FOR RENDER
//WRITTEN BY @Blubhouse1212123
/////////////////////////////////////////////////////////
//*******************************************************
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
            //Our problem now is these header strippers dont work, because we have to intercept the page before it sends or something like that i dont know.
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
//An attempt to do a proper/working version of rewriting headers
//i just found this code on some website, im just blindly attempting it.
//https://gist.github.com/rtwalz/c4e44c1d22187cfa0561843f0393122a?
app.get("/:d", function(req, res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Frame-Options", "DENY");
    request(decodeURIComponent(req.params.d)).pipe(res);
});
function proxy(html, url) {
    var cheerioHTML = cheerio.load(html);
    //I have to do it from here because the SOP, also referred to as the CIA is preventing me from doing it.
    //https://cheerio.js.org/docs/basics/selecting/ CIA Doesnt know what hit them
    //You have to do each not forEach like this, you cant use forEach on a const, must do cheerioHTML
    //Learned that with a quick google AI overview search.


    //I did this, which rewrites it via html level, but network level still stops me. I will try to propery strip the incoming request of its headers.
    //Stack overflow taught me this
    cheerioHTML("head").prepend(`
       <script>
       document.addEventListener("DOMContentLoaded", function() {
            var a = document.querySelectorAll("a");
            var aArray = [...a];
            aArray.forEach(a => {
                var originalHref = a.getAttribute("href");
                a.setAttribute("href", "https://rendernoguardianproxy-1.onrender.com/api?url=" + encodeURIComponent(originalHref));
            });
       });
        </script>
    `);
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("NoGuardian Proxy is running via Render");
});