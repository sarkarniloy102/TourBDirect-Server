const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_USER}:${process.env.db_PASS}@cluster0.mypgnvz.mongodb.net/?retryWrites=true&w=majority`;
console.log(process.env.db_USER);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const TravelPlaceCollection = client.db('TourBDirect').collection('Travel');

        app.get('/travelplace', async (req, res) => {

            const cursor = TravelPlaceCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);
// GET method route
app.get('/', (req, res) => {
    res.send('TourBDirect Server is running');
})
app.listen(port, () => {
    console.log(`TourBDirect Server is running on port ${port}`);
})