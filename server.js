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
    //Get all A elements and redirect their HREFs through the proxy url
    var a = cheerioHTML("a");
    var lengthOf = a.length;
    //He checks for > 0 because we want to know if it returned any before we attempt to manipulate them
    if (lengthOf > 0) {
        //attr reads and writes attributes, such as <a
        //href const is used to check the loop for each href
        //current href is used to read the current one in the loop we need to modify.
        const href = cheerioHTML("a").attr("href");
        cheerioHTML("a").each(function(index, element) {
            var currentHref = element.attribs.href;
            if (!currentHref.contains("https://rendernoguardianproxy-1.onrender.com/api?url=")) {
                //then add it!
                currentHref = "https://rendernoguardianproxy-1.onrender.com/api?url=" + encodeURIComponent(currentHref);
            }
        });
        return cheerioHTML.html();
    } else {
        console.warn("No Avalible A Elements!");
    }
    return cheerioHTML.html();

}
app.listen(PORT, () => {
    console.log("NoGuardian Proxy is running via Render");
});