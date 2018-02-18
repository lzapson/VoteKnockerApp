var connection = require("../config/connection");
var fs = require("fs");
var path = require("path");

module.exports = function(app){

    app.post("/api/filter", function(req,res){
        if (!req.body.party && !req.body.status) {
            connection.query("SELECT * FROM alphavoters",function(err, result) {
                if (err) throw err;
                res.json(result);
            });
        } else if (req.body.party != "" && req.body.status != "") {
            connection.query("SELECT * FROM alphavoters WHERE party=? and status=?", [req.body.party, req.body.status], function(err, result) {
                if (err) throw err;
                res.json(result);
            });
        } else if (req.body.party != "") {
            connection.query("SELECT * FROM alphavoters WHERE party=?", req.body.party, function(err, result) {
                if (err) throw err;
                res.json(result);
            });
        } else if (req.body.status != "") {
            connection.query("SELECT * FROM alphavoters WHERE status=?", req.body.status, function(err, result) {
                if (err) throw err;
                res.json(result);
            });
        }
    });

    app.get("/api/states", function(req,res){
        fs.readFile("public/assets/static/states.txt", "utf8", function(error, data) {
            if (error) {
                return console.log("Get States ", error);
            }
            // Then split it by commas (to make it more readable)
            var dataArr = data.split(",");
            res.json(dataArr);
        });  
      });

    // POST route for saving a new interaction
    app.post("/api/interactions", function(req, res) {
        console.log("req", req);
        var voterId = req.body.voterId;
        var knocked = req.body.knock == 1 ? true : false;
        var litDropped = req.body.handOutLit == 1 ? true : false;
        var petitionSigned = req.body.signPetition == 1 ? true : false;
        var today = new Date();
        var query = connection.query(
            "INSERT INTO voterinteractions SET ?",
            {
                AlphaVoterId: req.body.AlphaVoterId,
                voterId: voterId,
                knocked: knocked,
                litDropped: litDropped,
                petitionSigned: petitionSigned,
                email: req.body.email,
                phone: req.body.phone,
                createdAt: today,
                updatedAt: today
            },
            function(err, result) {
                console.log("result", result);
                if (err) throw err;  
                // res.redirect("../status/" + voterId);          
                res.json(voterId);
            }
          );
    });


    app.get("/status/:id", function(req, res) {
        var voterId = req.params.id;
        connection.query("SELECT * FROM alphavoters a, voterhistories h WHERE a.voterId =? and a.voterId = h.voterId", voterId, function(err, result) {
            var status = result[0];
            var history = result;
                connection.query("SELECT * FROM alphavoters a, voterinteractions i WHERE a.voterId =? and a.voterId = i.voterId ORDER BY i.updatedAt DESC", voterId, function(err, result) {
                    var interactions = result;
                    var voterStatus = {
                    status: status,
                    history: history,
                    interactions: interactions
                    }
                    res.render("status", voterStatus);
                });
            });
        });
      
      
        app.get("/interactions/:id", function(req, res) {
            var voterId = req.params.id;
            connection.query("SELECT * FROM alphavoters WHERE voterId =?", voterId, function(err, result) {
                var voter = {
                    voter : result[0]
                }
                res.render("interactions", voter);
            });
        });
      
        // GET route for getting all of the stats
        app.get("/userStats", function(req, res) {
            connection.query("SELECT * FROM alphavoters a, voterinteractions i WHERE a.voterId = i.voterId ORDER BY i.updatedAt DESC, i.voterId", function(err, result) {
              var interaction = {
                interactions : result
              };
              res.render("userStats", interaction);
            });
        });



    };  //module.exports