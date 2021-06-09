require("dotenv").config();

const express = require("express");
const mongodb = require("mongodb");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;
const dbUrl = process.env.DB_URL;

/* app.get("/", (req, res) => {
  mongoClient.connect(dbUrl, (err, client) => {
    if (err) throw err;
    let db = client.db("infinityMall");
    db.collection("users")
      .find()
      .toArray()
      .then(data => {
        res.status(200).json({data});
      })
      .catch(error => {
        res.status(404).json({ message: "Data not found" })
        console.log(error);
      });
  });
}); */

app.get('/', async(req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db('infinityMall');
        let data = await db.collection('users').find().toArray();
        if (data.length>0) res.status(200).json({data})
        else res.status(404).json({ message: "Data not found" })
        client.close();    
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
        console.log(error);
    }
}) 

app.post('/create', async(req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db('infinityMall');
        await db.collection('users').insertOne(req.body);
        res.status(200).json({ message: "Data inserted", data: req.body })
        client.close();    
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
        console.log(error);
    }
})

app.put('/update/:id', async(req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db('infinityMall');
        await db.collection('users').findOneAndUpdate({_id:objectId(req.params.id)},{$set:req.body});
        res.status(200).json({ message: "Data updated", data: req.body })
        client.close();    
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
        console.log(error);
    }
})

app.delete('/delete/:id', async(req, res) => {
    try {
        let client = await mongoClient.connect(dbUrl);
        let db = client.db('infinityMall');
        let data = await db.collection('users').findOne({_id:objectId(req.params.id)})
        await db.collection('users').deleteOne({_id:objectId(req.params.id)});
        res.status(200).json({ message: "Data deleted", data})
        client.close();    
    } catch (error) {
        res.status(500).json({ message: "Internal Server error" })
        console.log(error);
    }
})

app.listen(port, () => console.log(`listening on port...${port}`));
