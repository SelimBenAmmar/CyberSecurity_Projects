// grab the packages we need like express to consctruct the server
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Initialise the server from a jsrp point of view
var jsrp = require('jsrp');
var server = new jsrp.server();

// In the database, the server has 1 username and password. The verifier and salt of the password are stored in the server  
// The client verifier and client salt have been sent in First place par the client : client.createVerifier 
user = "selim"  ; 
pass= "alex" ;
Cverif ="0ccb345f59fd3ca458c12edb495a59f748d3ac7fca9a5ba8918c1ad802ad46122c0fefad7f947352b7572ba5a4871e2b6f0e3454bb29379e9c7bd04ed30a924e9d896ee4b2c576ccfc69d598139221e581beeb19a948138ffd4525f4177e60810e077fa92a08b6ec7745fc71a4fb3667929a2d7c8d0072df9f25a0901f6c6bb50a42a3ebb54f4b1887ee1e0c53a980d6abb3675ef4184ebbea8f9849e28c5b9ae9e2b3b8882d45aa8edbee8a789b432bce54d111a2aefaf2a57e405d696663f9d2e07ce688fc171ba03045758db5ca5723079a463fc559c4867fb32a95f99830542ad8f80d122e5eedb5b0e690c21fec10e6ed5880aab176b11f799c21b3fb5294bfb7318da09c59650ccc3ea0caf1a73e422e07bd0ca07fba77938174a9afdce4bbb2612765657759ade2e3dbacd6302c295807e5d78d53020b176b55da6d7ee8612d1b139305db1d92d574e53f19ba579610d69033498e9a1ea2ecfa63faac1af70a73e509167bf03dc69548f2aa35cde281bc1a9834fc55b7fddc5f2080012c30c80eb191c87a879377afe7e43c46026b4eba90d6b910518b58901f31947aa91ebd827ebb0375f07e4d0bc6304721f03a378960d7d1896d8cf81edad8208ef1fc1d6ad4b47f1fdf04001f5243af1d52ff76f65cf83fab81e957ed976f213c17d4960c67c6b2c5f5e056da3bb4c490c677bcefa22ce88446f9f024e43b3d6f";
Csal= "e02949fc3784fc18564b602ef80268f74d140df8852f97297207d3b00c786c65";

// To initialise the server
server.init({ salt: Csal, verifier: Cverif }, function(){
    sPubKey = server.getPublicKey();
});


/* The database of the server contains only verifiers/salts/users not passwords.
    First the server receives the username. He checks it. If he has it, he sends back the associated salt
*/

app.post('/api/login', function(req, res) {
    var username = req.body.username;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('access-Control-Allow-Origin','*');
    console.log('username = ' + username);
    console.log('salt = ' + server.getSalt() );
    if (username == "selim")
            res.send(server.getSalt());
    else 
        throw ("You are not allowed to connect. Your username does not exist.");
        
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
    if (b) {
        console.log ("Welcome you have the right to connect ");
        // Construct the response to send back to the client with the server's proof
        M2 = server.getProof();
        console.log("M2 =  " + M2);
        res.send(M2);
        }
    else 
        console.log("You are not allowed to connect. Your proof is false.");
});





// start the server
// app.use will take into account the errors 404 not found
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});
app.listen(port);
console.log('Server started! At http://localhost:' + port);
