const { MongoClient, ServerApiVersion } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
 
var _db;

module.exports = {
    connectToServer: async function () {
        client.connect();
        const db = client.db("test");
        _db = db;
        console.log("Successfully connected to MongoDB."); 
    },
   
    getDb: function () {
      return _db;
    },
  };