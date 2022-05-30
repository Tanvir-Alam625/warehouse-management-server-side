const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { query } = require("express");
const { response } = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.5plrc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// mongoDB connection
const run = async () => {
  try {
    await client.connect();
    const stoneCollection = client.db("stoneDBS").collection("stoneCollection");
    // load six api data
    app.get("/stonesHomePage", async (req, res) => {
      const query = {};
      const cursor = stoneCollection.find(query);
      const stones = await cursor.limit(6).toArray();
      res.send(stones);
    });
    // Count all Stone
    app.get("/countData", async (req, res) => {
      const count = await stoneCollection.estimatedDocumentCount();
      res.json(count);
    });
    // load inventory all api data with pagination
    app.get("/inventory", async (req, res) => {
      const page = parseInt(req.query.page);
      // console.log(query);
      const query = {};
      const cursor = stoneCollection.find(query);
      let stones;
      if (page) {
        stones = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        stones = await cursor.limit(10).toArray();
      }
      res.send(stones);
    });
    // load one api data
    app.get("/inventoryDetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const stone = await stoneCollection.findOne(query);
      res.send(stone);
    });
    //delivered api data
    app.put("/delivery/:id", async (req, res) => {
      const id = req.params.id;
      const updateStone = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateStone.quantity,
        },
      };
      const result = await stoneCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // set Quantity api data
    app.put("/setQuantity/:id", async (req, res) => {
      const id = req.params.id;
      const updateStone = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: updateStone.quantity,
        },
      };
      const result = await stoneCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //API--- data load for manageInventory
    app.get("/manageInventory", async (req, res) => {
      const query = {};
      const cursor = stoneCollection.find(query);
      const stones = await cursor.toArray();
      res.send(stones);
    });
    // API--- one data delete
    app.delete("/stone/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const stone = await stoneCollection.deleteOne(query);
      res.send(stone);
    });
    //add api data for client site
    app.post("/AddStone", async (req, res) => {
      const stone = req.body;
      const result = await stoneCollection.insertOne(stone);
      res.send(result);
    });
    //my items api data
    app.get("/myItem", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = stoneCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
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
