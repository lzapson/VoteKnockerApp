var connection = require("../config/connection");
var fs = require("fs");
var path = require("path");

// var db = require("../models");

module.exports = function(app){

    // app.post("/api/filter", function(req,res){
    //     if (req.body.party != "" && req.body.status != "") {
    //         db.AlphaVoter.findAll({
    //             where: {
    //                 party: req.body.party,
    //                 status: req.body.status
    //             }
    //         })
    //         .then(function(data) {
    //           res.json(data);
    //         });
    //     }else if (req.body.party != "" && req.body.status == "") {
    //         db.AlphaVoter.findAll({
    //             where: {
    //                 party: req.body.party
    //             }
    //         })
    //         .then(function(data) {
    //           res.json(data);
    //         });
    //     }else if (req.body.party == "" && req.body.status != "") {
    //         db.AlphaVoter.findAll({
    //             where: {
    //                 status: req.body.status
    //             }
    //         })
    //         .then(function(data) {
    //           res.json(data);
    //         });
    //     }else {
    //         db.AlphaVoter.findAll({ })
    //         .then(function(data) {
    //           res.json(data);
    //         });
    //     }
    // });

    app.post("/api/filter", function(req,res){
        connection.query("SELECT * FROM alphavoters",function(err, result) {
            if (err) throw err;
            res.json(result);
        });
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
        console.log(req.body);
        var knocked = req.body.knock == 1 ? true : false;
        var litDropped = req.body.handOutLit == 1 ? true : false;
        var petitionSigned = req.body.signPetition == 1 ? true : false;

        db.VoterInteractions.create({
            AlphaVoterId: req.body.AlphaVoterId,
            voterId: req.body.voterId,
            knocked: knocked,
            litDropped: litDropped,
            petitionSigned: petitionSigned,
            email: req.body.email,
            phone: req.body.phone
        }).then(function(dbInteraction) {
            res.json(dbInteraction);
        });
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
    
        // db.AlphaVoter.findAll({
        //   include: [db.VoterHistory],
        //   where: {
        //     voterId: req.params.id
        //   }
        // }).then(function(data) {
        //   var status = {
        //     status : data[0],
        //     history: data
        //   }
        //   res.render("status", status);
        // });
    
        });
      
      
        app.get("/interactions/:id", function(req, res) {
            db.AlphaVoter.findOne({
                where: {
                    voterId: req.params.id
                }
            }).then(function(data) {
                var voter = {
                    voter : data,
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
    
            // db.VoterInteractions.findAll({})
            // .then(function(data) {
            //     var interaction = {
            //     interactions : data
            //     };
            //     res.render("userStats", interaction);
            // });
        });



    };  //module.exports