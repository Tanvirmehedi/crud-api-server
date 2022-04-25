const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4000;

// Middle ware
app.use(cors());
app.use(express.json());

// DB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvflg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("crud").collection("crud-service");

    // create user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await database.insertOne(newUser);
      res.send(`From USER ${result}`);
    });

    // Read User
    app.get("/users", async (req, res) => {
      const query = req.query;
      const cursor = database.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Update user
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data.name,
          email: data.email,
        },
      };
      const result = await database.updateOne(filter, updateDoc, options);
      res.send("from update");
    });

    // Delete data
    app.delete("/user/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await database.deleteOne(query);
      res.send("Delete Successfully");
    });
  } finally {
  }
};
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send(`
<h1>CRUD Server Running</h1>



`);
});

app.listen(port, () => {
  console.log("CURD Server Is Running...");
});
