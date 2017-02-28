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
The password isn't stored in neither client side nor server side. However, a verifier is stored in the mongodb database.


How to use it : 

1- Download Mongo DB and install it. This will manage our non relational database.
  See the official documentation : https://docs.mongodb.com/manual/installation/

2- Launch the database with the command for Ubuntu/Debian : 
$ sudo service mongod start

3- Download the folder SRP. Open "index.html" with “Google Chrome”. 
Warning :
You have to use "Google Chrome". It does not work with "Firefox" and it is not tested with other browsers.

4- In a 2nd terminal, Open the folder "projet" located inside "SRP" and launch the node server : 
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
