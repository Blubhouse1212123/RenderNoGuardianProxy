//To Update this file, run git add .
//git commit -m "UPDATE DESCRIPTION"
//git push
const http = require("http");
const axios = require("axios");
const express = require("express");
const router = express.Router();
const postmanRequest = require("postman-request");
const cheerio = require("cheerio");
//This is the main function for GET requests.
router.get("/", function(req, res) {
    //This is the url we want to go to, such as example.com
    //we have to stick thus
    const url = req.query.url;
    const page = request.get(url, function(response, body) {
        const proxied = proxy(body, url);
        //Removing headers so we dont get issues of refusal.
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Content-Security-Policy");
        res.removeHeader("Access-Control-Allow-Origin");
        res.send(proxied);
    });
});
function proxy(html, url) {
    //get the html using cheerio to turn it into a genuine structure
    //i assume so we can load it properly later
    //man i suck at node js
    var cheerioHTML = cheerio.load(html);
    var content = "";
    var base = "<base href=\"" + url;
    $("head").append(base);
    return $.html();
}