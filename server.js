//Run update.ps1 to update the file to render and git
//TODO: I have un needed npm installs i need to rid of.
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
        } else {
            console.warn(error);
        }
    });
});
function proxy(html, url) {
    //I have to figure a way to load the file correctly
    //i be getting no such file or directory error.
    var frontend = fs.readFileSync("E:/NoGuardian/NoGuardian.html", "utf8");
    var loadedFrontend = cheerio.load(frontend);
    var cheerioHTML = cheerio.load(html);
    //cheerioHTML("iframe").attr("src", "https://the link");
    //Im gonna inject a script to get a elements and fix them.
    //cheerioHTML("head").prepend(`
     //   <script>
      //  document.addEventListener("DOMContentLoaded", function() {
       //     const a = document.querySelectorAll("a");
        //    a.forEach(link => {
         //       //if (!link.href.includes("https://rendernoguardianproxy-1.onrender.com/api?url=")) {
          //          //link.href = "https://rendernoguardianproxy-1.onrender.com/api?url=" + link.href; 
           //     //}
            //    link.addEventListener("click", () => {
             //       console.log("test");
              //  });
        //    });
        //});
 //       </script>
  //  `);
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("NoGuardian Proxy is running via Render");
});