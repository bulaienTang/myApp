const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/record").post(async function (req, response) {
    let db_connect = dbo.getDb();
    let result = await db_connect
        .collection("label")
        .findOne({username: req.body.name})
    response.json(result);
});

// // This section will help you get a single record by id
// recordRoutes.route("/record/:id").get(function (req, res) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection("label").findOne(myquery, function (err, result) {
//     if (err) throw err;
//     res.json(result);
//   });
// });

// This section will help you create a new record.
recordRoutes.route("/record/add").put(async function (req, response) {
    let db_connect = dbo.getDb();
    let query = {username: req.body.name};
    let doc = await db_connect.collection("label").findOne(query);
    let oldLabels = doc.labels;
    let updatedLabels = {
        $set: {
            labels: [...oldLabels, req.body.label],
        }
    };
    const result = await db_connect.collection("label").updateOne({username: req.body.name}, updatedLabels);
    // console.log(result);
    if(result.matchedCount == 0)
        console.log("[ERROR] No matching id, no label inserted");
    else 
        console.log("1 label inserted");
    response.json(result);
});

// This section will help you update a record by id.
recordRoutes.route("/update/:name/:id").put(async function (req, response) {
    let db_connect = dbo.getDb("test");
    let query = { username: req.params.name };
    let doc = await db_connect.collection("label").findOne(query);
    let index = req.params.id;
    doc.labels[index] = req.body.label;
    let updatedLabels = {
        $set: {
            labels: doc.labels,
        },
    };
    const result = await db_connect.collection("label").updateOne(query, updatedLabels);
    if(result.matchedCount == 0)
        console.log("[ERROR] No matching id, no label updated");
    else 
        console.log("1 label updated");
    response.json(result);
});

// This section will help you delete a record
recordRoutes.route("/:name/:id").delete(async function(req, response) {
    let db_connect = dbo.getDb();
    let query = {username: req.params.name};
    let doc = await db_connect.collection("label").findOne(query);
    let index = req.params.id;
    doc.labels.splice(index,1)
    let updatedLabels = {
        $set: {
            labels: doc.labels,
        }
    };
    let myquery = { username: req.params.name };
    const result = await db_connect.collection("label").updateOne(myquery, updatedLabels);
    if(result.matchedCount == 0)
        console.log("[ERROR] No matching id, no label deleted");
    else 
        console.log("1 label deleted");
    response.json(result);
});

module.exports = recordRoutes;
