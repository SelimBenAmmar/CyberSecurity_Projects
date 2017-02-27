# Security Projects 

1- SRP_authentication :

The aim of this project is to develop a form where a client can register and connect with a username and a password to a server. The authentication is based on the SRP protocol. 

Technical tools :

Client side = 
- HTML,CSS, Javascript
- XmlHttpRequest : to communicate with the server
- Node module JSRP +  browserify : to get the methods used with this protocol

Server side  =
- Node js
- Express
- Mongo DB : a non relational database

Everyone can create an account and then connect with his credentials. 
The password isn't stored in neither client side nor server side. However, a verifier is stored in the server.js file.


How to use it : 

1- Create an empty subdirectory in the directory /data. This folder will contain the database of the application. 
$ sudo mkdir dbSRP


2- Download Mongo DB and install it. This will manage our non relational database. 

- In a 1st  terminal, go to the folder mongodb you have just installed. Then open the folder bin and execute mongod : 
$ sudo ./mongod  -- dbpath /data/dbSRP
The option -- dbpath redirects mongod toward the location of our database

- If you want to use Mongo DB shell to follow the content of the database write in a 2nd terminal but in the same directory : 
$ ./mongo

3- Download the folder SRP. Open "index.html" with “Google Chrome”. It does not work with "Firefox" and it is not tested with other browsers. Open “Developer tools” in the menu of "Google Chrome" to follow all the steps during the connexion.

4- In a 3rd terminal. Open the folder "projet" located inside "SRP" and launch the node server : 
$ node server.js

=> The server and the database are normally working in two different ports. 8080 for the Node server and 27017 for the Mongo DB database.

Now you can open your browser, create an account and then connect  :)



Sources :


To understand the used node modules and tools
    
    Book : "Big Data, NOSQ. Architecting MONGODB" By Navin Sabharwal and Shakuntala Grupta Edward 
    https://openclassrooms.com
    https://nodejs.org/api/
    https://developer.mozilla.org/fr/docs/Web/API/XMLHttpRequest
    https://github.com/alax/jsrp/blob/master/README.md

To understand the theory of the protocol

    http://srp.stanford.edu/
    http://srp.stanford.edu/ndss.html#SECTION00031000000000000000

THIS PROJECT WAS MADE BY : Selim BEN AMMAR and Abdessalam BOULAHDID


2- Hacking WIFI :

This paper contains a great variety of possible attacks on WIFI : DofS, cracking passwords (WEP,WPA,WPA2,WPS), deauthentication, disassociation... 

