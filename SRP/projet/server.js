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
            db.collection("users").findOne({username : username }, function(error, result) {
                if (err) 
                    throw err;
                else 
                {
                    // If result= null then this element does not exist.  
                
                    if ( result != null )
                    {
                        // The username exists, hence we can extract the verifier and the salt from the collection users 
                        // Get the verifier from the database and transform it to a string
                        var Cverif = result.Cverif.toString();   
                        // Get the salt from the database and transform it to a string
                        var Csalt = result.Csalt.toString();

                        // To initialise the server
                        server.init({ salt: Csalt, verifier: Cverif }, function(){
                            sPubKey = server.getPublicKey();
                            console.log('username = ' + username);
                            console.log('salt = ' + server.getSalt() );
                            res.send(server.getSalt());
                        });
                        db.close();
                    }
                    else 
                    {
                        console.log("\n \n Votre username n'existe pas. Veuillez vous inscrire.  \n \n");
                    	res.send("false");
                    }
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
        console.log (" Bienvenue, vous avez le droit de vous connecter.");
        // Construct the response to send back to the client with the server's proof
        M2 = server.getProof();
        console.log("M2 =  " + M2);
        res.send(M2);
    }
    else 
    {
        console.log("Vous n'avez pas le droit de vous connecter. Votre preuve est fausse.");
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
            db.collection("users").findOne({username : user }, function(error, result) {
                if (err) 
                    throw err;
                else 
                {
                    // If result = null then this element does not exist.  
                    if ( result == null )
                    {
                    	// Create a document to insert in the database MongoDB
                    	var doc = { username : user, Cverif : verif, Csalt : salt }; 
                    	db.collection("users").insert(doc, {w: 1}, function(err, records)
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
                	else
                	{
                		console.log("Votre inscription n'a pas pu avoir lieu. Ce username est déjà utilisé.");
                        res.send("votre inscription n'a pas pu avoir lieu. Le username " + user + " est déjà utilisé." );
                	}
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
