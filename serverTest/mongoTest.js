import { MongoClient } from "mongodb";
var url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const db = client.db("大山");
    // //新增数据
    const collection = db.collection("user");
    // // const result = await collection.insertOne({ username: "nodejs", age: 10 });
    const result = await collection.findOne({ age: 10 });

    // // console.log("Connected successfully to server");
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
