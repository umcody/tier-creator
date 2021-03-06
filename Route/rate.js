const ratingsCriterions = require("./ratingCriterions.json");

module.exports = function (app, mongoose) {

    let itemSchema = new mongoose.Schema({
        rank: Number,
        image: String,
        name: String,
        title: String,
        count: Number,
        category: String,
        ratings: Object,
        reviewCounts: Number,
        reviews: Array,
        tags: Object,
    })

    function generateTagsQuery(array) {
        let query = {}
        array.forEach(element => {
            query[`tags.${element.text}`] = 1;
        });
        console.log(query);
        return query;
    }

    app.post("/api/rate/:school/:category/:title/:item", function (req, res) {

        const school = req.params.school;
        const title = req.params.title;
        const item = req.params.item;
        const category = req.params.category;

        let Item;
        try {
            Item = mongoose.model(school+"campus");
        } catch (error) {
            Item = mongoose.model(school+"campus",itemSchema);
        }

        let query = generateTagsQuery(req.body.tags);

        Item.findOne({name: item, title:title}, function (err, data) {

            const tempRatings = Object.entries(data.ratings);
            let averageQuery = {};
            // Average calculations
            for (let i = 0; i < ratingsCriterions[category].length; i++) {
                let criterion = ratingsCriterions[category][i];
                let temp = tempRatings[i][1] * data.reviewCounts;
                averageQuery[`ratings.${criterion}`] = (temp + parseFloat(req.body[criterion]) * 100) / (data.reviewCounts + 1);
            }

            let name = req.body.name;
            if (req.body.review === ' ' || req.body.review === "") { // If there is no review, empty the name too. 
                name = "";
                Item.findOneAndUpdate({name: item,title:title}, {
                    $inc:{...query,"reviewCounts":1},
                    $set:averageQuery,
                },{strict:false}, function (err, data) {
                    if (err) {
                        console.log(err);
                    }else{
                        res.status(200);
                    }
                })

            } else {

                if (req.body.name === "" || req.body.name === undefined) {
                    name = "Anonymous";
                }
                const review = req.body.review;
                const reviews = [[name, review]]


                Item.findOneAndUpdate({name: item,title:title}, {
                    $set:averageQuery,
                    $inc: {...query,"reviewCounts": 1 },
                    $push: {
                        reviews
                    }
                },{strict:false}, function (err, data) {
                    if (err) {
                        console.log(err);
                    }else{
                        res.status(200);
                    }
                })
            }

        })

    })

{
/*
    // SHOULD AUTOMATE THIS WITH A FUNCTION INSTEAD OF THREE SEPERATE HARD CODED GET METHODS
    app.post("/api/rate/gym/:title/:item", function (req, res) {
        const title = req.params.title;
        const item = req.params.item;

        let Item
        try {
            Item = mongoose.model(title);
        } catch (error) {
            Item = mongoose.model(title, itemSchema);
        }

        console.log(req.body);

        let query = generateTagsQuery(req.body.tags);

        Item.findOne({ name: item }, function (err, data) {
            console.log(data);
            const tempRatings = Object.entries(data.ratings);
            console.log(tempRatings);
            let tempOverall = 0;
            console.log(req.body.friendliness + req.body.space + req.body.overall);

            tempOverall = tempRatings[0][1] * data.reviewCounts;
            tempOverall = (tempOverall + parseFloat(req.body.overall) * 100) / (data.reviewCounts + 1);



            let tempSpace = tempRatings[1][1] * data.reviewCounts;
            tempSpace = (tempSpace + parseFloat(req.body.space) * 100) / (data.reviewCounts + 1);

            let tempFriendliness = tempRatings[2][1] * data.reviewCounts;
            tempFriendliness = (tempFriendliness + parseFloat(req.body.friendliness) * 100) / (data.reviewCounts + 1);

            let name = req.body.name;

            if (req.body.review === " " || req.body.review === "") { // If there is no review, empty the name too. 
                name = "";
                Item.findOneAndUpdate({ name: item }, {
                    "ratings.Overall": tempOverall,
                    "ratings.Space": tempSpace,
                    "ratings.Friendliness": tempFriendliness,
                    $inc: { reviewCounts: 1, query },
                    $push: {
                        reviews
                    }
                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            } else {
                if (req.body.name === "") {
                    name = "anonymous";
                }
                const review = req.body.review;
                const reviews = [[name, review]]


                Item.findOneAndUpdate({ name: item }, {
                    "ratings.Overall": tempOverall,
                    "ratings.Space": tempSpace,
                    "ratings.Friendliness": tempFriendliness,
                    $inc: { reviewCounts: 1, query },
                    $push: {
                        reviews
                    }
                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            }

        })
    })

    app.post("/api/rate/dininghall/:title/:item", function (req, res) {
        const title = req.params.title;
        const item = req.params.item;

        let Item
        try {
            Item = mongoose.model(title);
        } catch (error) {
            Item = mongoose.model(title, itemSchema);
        }

        console.log(req.body);


        Item.findOne({ name: item }, function (err, data) {
            const tempRatings = Object.entries(data.ratings);

            // Average calculations for each criterions

            let tempOverall = tempRatings[0][1] * data.reviewCounts;
            console.log(tempOverall);
            tempOverall = (tempOverall + parseFloat(req.body.overall) * 100) / (data.reviewCounts + 1);
            console.log(tempOverall);

            let tempTaste = tempRatings[1][1] * data.reviewCounts;
            tempTaste = (tempTaste + parseFloat(req.body.taste) * 100) / (data.reviewCounts + 1);

            let tempHygiene = tempRatings[2][1] * data.reviewCounts;
            tempHygiene = (tempHygiene + parseFloat(req.body.hygiene) * 100) / (data.reviewCounts + 1);

            let tempVariety = tempRatings[3][1] * data.reviewCounts;
            tempVariety = (tempVariety + parseFloat(req.body.variety) * 100) / (data.reviewCounts + 1);

            let tempNutrition = tempRatings[4][1] * data.reviewCounts;
            tempNutrition = (tempNutrition + parseFloat(req.body.nutrition) * 100) / (data.reviewCounts + 1);

            let tempPrice = tempRatings[5][1] * data.reviewCounts;
            tempPrice = (tempPrice + parseFloat(req.body.price) * 100) / (data.reviewCounts + 1);



            let name = req.body.name;
            if (req.body.review === ' ' || req.body.review === "") { // If there is no review, empty the name too.

                name = "";

                //PREPARE THE $INC QUERY FOR THE TAGS
                let query = {}
                req.body.tags.forEach(element => {
                    query[`tags.${element.text}`] = 1;
                });
                console.log(query);


                Item.findOneAndUpdate({ name: item }, {
                    "ratings.overall": tempOverall,
                    "ratings.taste": tempTaste,
                    "ratings.hygiene": tempHygiene,
                    "ratings.variety": tempVariety,
                    "ratings.nutrition": tempNutrition,
                    "ratings.price": tempPrice,

                    $inc: { reviewCounts: 1 },

                    $inc: query



                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            } else { // If there is review ...
                console.log("HERE");
                if (req.body.name === "" || req.body.name === undefined) {
                    name = "Anonymous";
                }
                const review = req.body.review;
                const reviews = [[name, review]];


                //PREPARE THE $INC QUERY FOR THE TAGS
                let query = {}
                req.body.tags.forEach(element => {
                    query[`tags.${element.text}`] = 1;
                });
                console.log(query);

                //UPDATE
                Item.findOneAndUpdate({ name: item }, {
                    "ratings.overall": tempOverall,
                    "ratings.taste": tempTaste,
                    "ratings.hygiene": tempHygiene,
                    "ratings.variety": tempVariety,
                    "ratings.nutrition": tempNutrition,
                    "ratings.price": tempPrice,

                    $inc: { reviewCounts: 1 },
                    $push: {
                        reviews
                    },
                    $set: {
                        tags: {
                            $inc: {
                                query
                            }
                        }
                    }
                }, { strict: false }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            }

        })
    })
    app.post("/api/rate/library/:title/:item", function (req, res) {
        const title = req.params.title;
        const item = req.params.item;

        let Item
        try {
            Item = mongoose.model(title);
        } catch (error) {
            Item = mongoose.model(title, itemSchema);
        }

        console.log(req.body);

        let query = generateTagsQuery(req.body.tags);

        Item.findOne({ name: item }, function (err, data) {
            console.log(data);
            const tempRatings = Object.entries(data.ratings);
            console.log(tempRatings);

            // Average calculations for each criterions
            console.log(tempRatings[0][1])
            let tempOverall = tempRatings[0][1] * parseFloat(data.reviewCounts);
            console.log(tempOverall);

            tempOverall = (tempOverall + parseFloat(req.body.overall) * 100) / (data.reviewCounts + 1);
            console.log(tempOverall);

            let tempNoise = tempRatings[1][1] * data.reviewCounts;
            tempNoise = (tempNoise + parseFloat(req.body.noise) * 100) / (data.reviewCounts + 1);

            let tempSpace = tempRatings[2][1] * data.reviewCounts;
            tempSpace = (tempSpace + parseFloat(req.body.space) * 100) / (data.reviewCounts + 1);

            let tempAccessibility = tempRatings[3][1] * data.reviewCounts;
            tempAccessibility = (tempAccessibility + parseFloat(req.body.accessibility) * 100) / (data.reviewCounts + 1);

            let tempResource = tempRatings[4][1] * data.reviewCounts;
            tempResource = (tempResource + parseFloat(req.body.resource) * 100) / (data.reviewCounts + 1);


            let name = req.body.name;
            if (req.body.review === ' ' || req.body.review === "") { // If there is no review, empty the name too. 
                name = "";
                Item.findOneAndUpdate({ name: item }, {
                    "ratings.overall": tempOverall,
                    "ratings.noise": tempNoise,
                    "ratings.space": tempSpace,
                    "ratings.accessibility": tempAccessibility,
                    "ratings.resource": tempResource,

                    $inc: { reviewCounts: 1 },
                    $inc: query

                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })

            } else {
                console.log("HERE");
                console.log(req.body.name);
                if (req.body.name === "" || req.body.name === undefined) {
                    name = "Anonymous";
                }
                const review = req.body.review;
                const reviews = [[name, review]]


                Item.findOneAndUpdate({ name: item }, {
                    "ratings.overall": tempOverall,
                    "ratings.noise": tempNoise,
                    "ratings.space": tempSpace,
                    "ratings.accessibility": tempAccessibility,
                    "ratings.resource": tempResource,

                    $inc: { reviewCounts: 1 },
                    $push: {
                        reviews
                    },
                    $inc: query
                }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            }

        })
    })
    */
}
}