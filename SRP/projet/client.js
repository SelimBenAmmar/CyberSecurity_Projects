/* This file contains 2 functions:
  -  The first one is called envoi(). It will be called when we need to connect. The username should already have an account.

  - The Second one is called enregistrer(). It will be called when we need to register a client.
*/


// The first one is called envoi(). It will be called when we need to connect. The username should already have an account.
        function envoi() 
        {
          // Création et initialisation de XML Request and the client object
          var xhr = new XMLHttpRequest();
          var client = new jsrp.client();

          /* salt = the salt that the server will send to the client after the first xml request
             sPubKey = the server public key that will be send to the client after the second xml request
             M2 = the second proof received by the server
          */
          var salt = "";
          var sPubKey = "";
          var M2 = "" ;

          // In order to encode both of them before sending the username
          user = encodeURIComponent ( document.getElementById('username').value ) ;
          pass = encodeURIComponent ( document.getElementById('password').value ) ;

          /* The first promise will initialise the client.
          If there is a success, the first request xhr is sent with the username and the response will contain the salt.
          Otherwise we throw an error.
          */

          var p1 = new Promise(function(resolve, reject) {

                client.init({ username: user , password: pass }, function () {
                
                  // This is a callback function : If the request was sent correctly, we get back to salt and we store it in the client object.
                  xhr.onreadystatechange = function() {

                    // The condition is true when the response is ready
                    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) 
                    {
                      salt = xhr.responseText;
                      client.setSalt(salt);
                      console.log("salt client = " + client.getSalt() );
                      resolve ("Le username est envoyé au serveur et le salt est bien récupéré.")
                    } 
                  }
                  // We connect with the server with the POST method to the url mentioned above. true = We use asynchronous communication 
                  xhr.open("POST", "http://localhost:8080/api/login", false);
                  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");          
                  xhr.send("username=" + user);
                });

          });





         
          var p2 = p1.then(function(value) {
            // En cas de succès :
            console.log(value);

            return new Promise(function(resolve, reject) {

            /*  The password = private key
                The verifier is a public key extracted from the private key (password) and it is kept secret by the server. 
                The server has a database of verifers but it doesn't store the passwords. Thus, compromising the database isn't a catastrophe 
            */
            
              xhr.onreadystatechange = function() {
                // The condition is true when the response is ready
                 if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                    sPubKey = xhr.responseText;
                    client.setServerPublicKey(sPubKey);
                    console.log("server pub key = " + sPubKey );
                    resolve ("La clé publique du client est envoyée et celle du serveur est récupérée.")
                }
              }
              xhr.open("POST", "http://localhost:8080/api/login2", false);
              xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
              // The Client generates and sends to the server his ephemeral public key A based on a random private key a. 
              cPubKey = client.getPublicKey();
              xhr.send ("cPubKey=" + cPubKey );
            
            });   

            }, function(reason) {
            console.log(reason); // Error!
            });


    

          var p3 = p2.then(function(value) {
            // En cas de succès :
            console.log(value);

            return new Promise(function(resolve, reject) {
                /* After exchanging public keys. The last step is to check if both the client and the server have the same proof: exchanging M1 and M2. 
                */

                  xhr.open("POST", "http://localhost:8080/api/login3", false);
                  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                   // The client computes the shared key S for future crypto usage
                   sharedKey = client.getSharedKey();
                   console.log( "Shared Key =  "  + sharedKey );
                   // The client computes M1, the value that will be send to the server
                   M1 = client.getProof();
                   console.log("M1  = " + M1);

                    xhr.onreadystatechange = function() {
                    // The condition is true when the response is ready
                    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                      
                      // Get the server's proof and compares it. The aim is to check if this is the right server.
                      M2 = xhr.responseText; 
                      // We check if the server sent a real M2
                      if (M2 != "false")
                      { 
                        console.log("M2 =  " + M2);
                        // b is a boolean. If the server is the right one, b = true. If it is not, b = false
                        b = client.checkServerProof(M2);
                        console.log ("b  client  = "  + b)
                        if (b == true)
                          alert("Welcome to the right server. You are finally connected.");
                        else 
                          alert("You are not allowed to connect. Your proof is false.");
                      }
                      else 
                        alert("You are not allowed to connect. Your proof is false.");
                    }
                    }
                    xhr.send("M1=" + M1);
              });
            
              }, function(reason) {
            console.log(reason); // Error!
            });
            
        }






// The Second function is called enregistrer(). It will be called when we need to register a client.
      function enregistrer() 
        {
          // Création et initialisation de XML Request and the client object
          var xhr = new XMLHttpRequest();
          var client = new jsrp.client();

          /* salt = the salt that the server will send to the client after the first xml request
             sPubKey = the server public key that will be send to the client after the second xml request
          */
          var salt = "";
          var sPubKey = "";
          var M2 = "" ;

          // In order to encode both of them before sending the username
          user = encodeURIComponent ( document.getElementById('username').value ) ;
          pass = encodeURIComponent ( document.getElementById('password').value ) ;


          /* The first promise will initialise the client.
          If there is a success, the first request xhr is sent with the username and the response will contain the salt.
          Otherwise we throw an error.
          */

          var p1 = new Promise(function(resolve, reject) {

                client.init({ username: user, password: pass }, function () {
                  client.createVerifier(function(err, result) {

                    // This is a callback function : If the request was sent correctly, we get back to salt and we store it in the client object.
                    xhr.onreadystatechange = function() {
                      // The condition is true when the response is ready
                      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0))
                          resolve ("Nous vous informons que " + xhr.responseText ) ;
                    }
                    // We connect with the server with the POST method to the url mentioned above. true = We use asynchronous communication 
                    xhr.open("POST", "http://localhost:8080/api/enregistrer", false);
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");           
                    // result will contain the necessary values the server needs to
                    // authenticate this user in the future.
                    xhr.send("username=" + user + "&salt=" + result.salt + "&verifier=" + result.verifier);

                  });
                });
          });

  			p1.then(function(value) {
            // En cas de succès :
            alert(value);
              }, function(reason) {
            console.log(reason); // Error!
            });

        }


