// We grab the packages we need like express to consctruct the server
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

// bodyParser will help express to read data from the form
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) ;


// Start the mongo database
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://localhost:27017/dbSRP';

// Initialise the server from a jsrp point of view
var jsrp = require('jsrp');
var server = new jsrp.server();


/* The database of the server contains only verifiers/salts/users not passwords.
    First the server receives the username. He checks it. If he has it, he sends back the associated salt
*/

app.post('/api/login', function(req, res) {
    var username = req.body.username;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('access-Control-Allow-Origin','*');


    MongoClient.connect(URL, function(err, db) {
        if (err) 
            throw err;
        else 
        {
            // We test if the entered username exists in the database or not
            db.collection('users', function(err, collection) {
                if (err) 
                    throw err;
                else 
                {
                    var b = collection.find( {username : username }, {"_id" : 1}); 
                    if ( b != null )
                    {
                        // The username exists, hence we can extract the verifier and the salt from the collection users 
                        collection.find( { username: username }, { Cverif: 1, _id: 0 } ).toArray(function(err, docs) {
                            // Get the verifier from the database and transform it to a string
                            var Cverif = JSON.stringify(docs[0]).substring(11);
                            Cverif = Cverif.substring(0, Cverif.length -2 ) ; 
                            collection.find( { username: username }, { Csalt: 1, _id: 0 } ).toArray(function(err, docs) {        
                                // Get the salt from the database and transform it to a string
                                var Csalt = JSON.stringify(docs[0]).substring(10);
                                Csalt = Csalt.substring(0, Csalt.length -2 ) ; 
                                // To initialise the server
                                server.init({ salt: Csalt, verifier: Cverif }, function(){
                                    sPubKey = server.getPublicKey();
                                    console.log('username = ' + username);
                                    console.log('salt = ' + server.getSalt() );
                                    res.send(server.getSalt());
                                });
                                db.close();
                            });
                            
                        });
                    }
                    else 
                        console.log("\n \n You are not allowed to connect. Your username does not exist. \n \n");
                }
            });
        }
    });
});


// Second, the server gets the client public key computes his own public key and sends it to the server

app.post('/api/login2', function(req, res) {
    // Get the client public key from the request
    var cPubKey = req.body.cPubKey;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('access-Control-Allow-Origin','*');
    server.setClientPublicKey(cPubKey);
    console.log("\n The client Public Key is = " + cPubKey);

    // Construct the response to send back to the client with the server public key 
    res.send(sPubKey);
    console.log("\n The server Public Key is = " + sPubKey);

});




// Third, the server receives the client proof, computes his own proof and compares them before sending back his own proof 

app.post('/api/login3', function(req, res) {
    // Get the client's proof from the request
    var M1 = req.body.M1;
    console.log("M1  = " + M1);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('access-Control-Allow-Origin','*');
    // Compute the shared key from the server's side
    sharedKey = server.getSharedKey() ;
    console.log ("shared key = " + sharedKey)
    // b is a boolean. If the client has the right to connect, b = true. If he is not allowed to, b = false
    b = server.checkClientProof(M1) ;
    console.log(b);
    if (b) 
    {
        console.log ("Welcome you have the right to connect ");
        // Construct the response to send back to the client with the server's proof
        M2 = server.getProof();
        console.log("M2 =  " + M2);
        res.send(M2);
    }
    else 
    {
        console.log("You are not allowed to connect. Your proof is false.");
        M2 = "false" ;
        res.send(M2);
    }
});









// When a user wants to create an account
app.post('/api/enregistrer', function(req, res) {
    var user = req.body.username;
    var salt = req.body.salt;
    var verif = req.body.verifier;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('access-Control-Allow-Origin','*');

    MongoClient.connect(URL, function(err, db) {
        if (err) 
            throw err;
        else 
        {
            // We test if the entered username exists in the database or not
            db.collection('users', function(err, collection) {
                if (err) 
                    throw err;
                else 
                {
                    // Create a document to insert in the database MongoDB
                    var doc = { username : user, Cverif : verif, Csalt : salt }; 
                    collection.insert(doc, {w: 1}, function(err, records)
                    {
                        if (err)
                            throw err ;
                        else 
                        {   
                            console.log("L'inscription a bien eu lieu.");
                            console.log(doc);
                            res.send("votre inscription a bien eu lieu avec le username : " + user );
                        }
                    }); 
                    db.close();  
                } 
            });
        }
    });
});




/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// Start server
app.listen(port);
console.log('Server started! At http://localhost:' + port);
