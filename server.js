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
//I figured out how to get the base skeleton code 
//https://gist.githubusercontent.com/shaond/f1d5d6250a0411675990/raw/a5159bf84cf46b305a779f8b8f1cb4eb22ea9e36/proxy.js
//Kinda reverse engineered that
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
            res.removeHeader("Referer");
            res.removeHeader("Referrer-Policy");
            res.send(proxied);
        }
    });
});
//An attempt to do a proper/working version of rewriting headers
//i just found this code on some website, im just blindly attempting it.
//https://gist.github.com/rtwalz/c4e44c1d22187cfa0561843f0393122a?
//This didnt work but ill leave it cuz whatever
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


    //Inject data into the Iframe that communicates with the parent (html)
    //They are linked because this tag is injected into the html of the displayed page
    //I learned this method from:https://www.youtube.com/watch?v=r2_A3bh94fY&msockid=a49041219c0211f1ad79312e0ff05b68
    //and:https://www.youtube.com/watch?v=SXb5LN_opbA
    cheerioHTML("head").prepend(`
       <script>
        console.log("NoGuardian Server: Linker script injection complete!");
        console.warn("NoGuardian Server: Please understand that you may encounter various console errors, this is normal");
        document.addEventListener("DOMContentLoaded", function() {
            var a = document.querySelectorAll("a");
            var aArray = [...a];
            aArray.forEach(element => {
                element.addEventListener("click", () => {
                    event.preventDefault();
                    const link = element.getAttribute("href");
                    window.parent.postMessage(link, "*");
                });
            });
            var images = document.querySelectorAll("link");
            var imagesArray = [...images];
            imagesArray.forEach(image => {
                var relitaveLink = image.getAttribute("href");
                image.setAttribute("href", "https://rendernoguardianproxy-1.onrender.com/api?url=" + encodeURIComponent(relitaveLink));    
            });
        });
        </script>
    `);
    //Gotta Try to make the iframe work for the games
    //It keeps saying i can only play it on crazygames
    //I think the CIA did it
    //Okay so like CIA got cooked again because the game devs are too dumb to add security
    return cheerioHTML.html();

}
app.listen(PORT, () => {});