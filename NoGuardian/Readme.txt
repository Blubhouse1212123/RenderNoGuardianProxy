**************************************
NoGuardian
An open-source, versatile and fully portable proxy
By @Blubhouse1212123
**************************************


Thanks for using NoGuardian! This text file contains all necessary things you need to know.


How to use:
To use NoGuardian, open the "NoGuardian.html" file in the main directory, this is the main browsing application. Once opened, click on the url box and enter any URL, this must begin with http:// or https:// or the application will output an error. After you are finished, press enter to spin up a proxied instance of the site inside the iframe. (iframe is displayed inside the page)


How it works:
NoGuaridan works by having a local html frontend contact a custom made NodeJS server hosted on Render to display a site. Redirects are accomplished by using the postMessage method to send href data back to the local file about where the user clicked, and setting the iframe's src to the Render url plus an encoded version of the href.


NOTICE: DO NOT TOUCH ANY OTHER FILES!!! THESE FILES ARE CRUCIAL TO THE SUCCESSFUL OPERATION OF THE PROXY, AND MODIFYING OR DELETING ANYTHING WILL BREAK THE PROXY!