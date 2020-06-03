var Search = require('../Model/searchModel.js');
const passport = require("passport");
const jwt = require("jsonwebtoken");
var UserModel = require("../Model/userModel");
const VOTELIMIT = 3;


module.exports = function (app, mongoose) {

    let itemSchema = new mongoose.Schema({
        rank: Number,
        image: String,
        name: String,
        title: String,
        count: Number,
        category: String,
        ratings: Object,
        reviews: Array
    })


    //Get information of the items in the appropriate title
    app.get("/api/ranked/:title", (req, res) => {
        let title = req.params.title;
        let Item;
        try {
            Item = mongoose.model(title);
        } catch (error) {
            Item = new mongoose.model(title, itemSchema);
        }
        Item.find({}).sort({ count: -1 }).exec(function (err, docs) {
            if (err) {
                return console.log(err);
            }
            console.log(docs);
            res.json(docs);
        })
    });


    // API call when the user votes up for the selected item. 
    app.get("/ranked/:title/api/upvote/:item", function (req, res) {

        let title = req.params.title;
        let item = req.params.item;
        let shouldInc = false;
        console.log("LOOKING FOR IT");


        // Check How many votes the user has already used in the selected title. If none, create. If limit, do not allow voting
        passport.authenticate("jwt", { session: false }, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                function incrementItem (){ // FUNCTION TO INCREMENT ITEM COUNT -- TO BE CALLED LATER WHEN CONDITION IS MET
                        let Item;
                        try {
                            Item = mongoose.model(title);
                        } catch (error) {
                            Item = new mongoose.model(title, itemSchema);
                        }
                        console.log("accessed");

                        //Update the item votes
                        Item.findOneAndUpdate({ name: item }, { $inc: { count: 1 } }, function (err, data) {
                            if (err) {
                                return console.log(err);
                            }
                            if (data === null) {
                                console.log("NO SUCH ITEM FOUND!!");
                            } else {
                                console.log(data + " is incrmented too")
                            }
                            console.log("UPDATED: " + data);
                        });

                        Search.findOneAndUpdate({ url: title }, { $inc: { totalCount: 1 } }, function (err, data) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("UPDATED: " + data);
                        });
                        shouldInc = false;
                }



                UserModel.findOne({ email: user.email, "voted.title": title }, function (err, data) {
                    console.log(data);
                    if (err) {
                        return console.log(err);
                    } else {
                        if (data === null) { // IF user has not voted on the title
                            UserModel.findOneAndUpdate({ email: user.email }, {
                                $push:
                                {
                                    voted: {
                                        title: title,
                                        count: 1,
                                        lastVoted: new Date()
                                    }
                                }
                            }, function (err, data) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("User has not voted on this title yet. Created a new title");
                            })
                            shouldInc = true;
                            incrementItem();
                            res.json({ count: 1 , increment : true});

                        } else { // If user has already voted on the title
                            let i = 0;
                            for (i; i < data.voted.length; i++) { // search for the index where the title resides
                                if (data.voted[i].title === title) {
                                    break;
                                }
                            }
                            if (data.voted[i].count < VOTELIMIT) {
                                console.log("IT IS HERE");
                                UserModel.findOneAndUpdate({ email: data.email, "voted.title": title }, {
                                    $inc: { "voted.$.count": 1 }
                                }, function (err, doc) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log("Count successfully incremented");
                                    shouldInc = true; // set to True to update all the doc.
                                    incrementItem();
                                    console.log(shouldInc);
                                    res.json({ count: data.voted[i].count++, increment: true });
                                })
                            } else {
                                if ((new Date().getDate() - data.voted[i].lastVoted.getDate()) !== 0) { // If it has been a day since last reached maximum, reset.
                                    UserModel.findOneAndUpdate({ email: data.email, "voted.title": title }, {
                                        $set: {
                                            "voted.$.count": 1,
                                            "voted.$.lastVoted": new Date()
                                        }
                                    }, function (err, doc) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            shouldInc = true; // Set to True to update the docs
                                            incrementItem();
                                            res.send({ count: 1, increment: true });
                                        }
                                    })
                                } else {
                                    res.send({ count: data.voted[i].count, increment: false });
                                }

                            }
                        }

                    }
                })
            }
        })(req, res);


    })

    // TO BE DEVELOPED. DOWN VOTE SYSTEM.
    app.post("/ranked/api/:title/downvote/:item", function (req, res) {
        let title = req.params.title;
        console.log(req.params);
        let item = req.params.item;
        console.log(req);

        const Item = new mongoose.model(title, itemSchema);
        console.log("accessed");

        Item.findOneAndUpdate({ name: item }, { $inc: { count: -1 } }, function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("UPDATED: " + data);
        });

        Search.findOneAndUpdate({ url: title }, { $inc: { totalCount: -1 } }, function (err, data) {
            if (err) {
                return console.log(err);
            }
            console.log("UPDATED: " + data);
        });
    })
}