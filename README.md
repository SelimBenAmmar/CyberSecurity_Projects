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

The database contains only a username and an associated password. However, everyone can create an account and then connect with his credentials. 
user = 'selim'
pass = 'alex'

The password isn't stored in neither client side nor server side. However, a verifier is stored in the server.js file.


How to use it : 

1- Download the folder SRP.

2- Open index.html with “Google Chrome”. It does not work with Firefox and it is not tested with other browsers. Choose Google Chrome. Open “Developer tools” to follow all the steps during the connexion.

3- Open database “Mongo DB” :
- In a 1st  terminal, go to the folder SRP. Then write : $ cd mongodb/bin
- Then execute mongod : $ sudo ./mongod  -- dbpath ../../dbSRP
   The option -- dbpath redirects mongod toward our database
-  If you want to use Mongo DB shell to follow the content of the database write in a 2nd terminal but in the same directory : $ ./mongo

4- In a 3rd terminal. Open projet and launch the node server : $ node server.js

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


2- Hacking WIFI :

This paper contains a great variety of possible attacks on WIFI : DofS, cracking passwords (WEP,WPA,WPA2,WPS), deauthentication, disassociation... 

