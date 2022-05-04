const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
// 5EsP2pIrpuhJFX9G
//stoneDB
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.5plrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   const collection = client.db("stoneDBS").collection("stoneCollection");
//   // perform actions on the collection object
//   console.log("db connected");
//   // client.close();
// });

// mongoDB connection
const run = async () => {
  try {
    await client.connect();
    const stoneCollection = client.db("stoneDBS").collection("stoneCollection");
    app.get("/stones", async (req, res) => {
      const query = {};
      const cursor = stoneCollection.find(query);
      const stones = await cursor.toArray();
      res.send(stones);
      // console.log(stoneCollection);
    });
  } finally {
    // nothing
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log("server port is", port);
});
