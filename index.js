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
        const TourGuideCollection = client.db('TourBDirect').collection('TourGuides');
        const BookingCollection = client.db('TourBDirect').collection('UserBookings');
        const UserCollection = client.db('TourBDirect').collection('Users');
        const WishlistCollection = client.db('TourBDirect').collection('UserWishlist')

        // for home section to show only 3 cart
        app.get('/travelplace', async (req, res) => {
            const query = {};
            const sort = { length: -1 };
            const limit = 3;
            const cursor = TravelPlaceCollection.find(query).sort(sort).limit(limit);
            const result = await cursor.toArray();
            res.send(result);

        })
        app.get('/allplace', async (req, res) => {
            const cursor = TravelPlaceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // single details based on id
        app.get('/allplace/:id', async (req, res) => {
            const id = req.params.id;
            const options = {
                projection: {}
            };
            const query = { _id: new ObjectId(id) };
            const result = await TravelPlaceCollection.findOne(query);
            res.send(result);
        })
        // purchase booking
        app.post('/mybookings', async (req, res) => {
            const newBooking = req.body;
            console.log(newBooking);
            const result = await BookingCollection.insertOne(newBooking);
            res.send(result);
        })
        // get user booking
        app.get('/mybookings', async (req, res) => {
            const cursor = BookingCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/tourguides', async (req, res) => {
            const cursor = TourGuideCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })
        // single details based on id guideProfile
        app.get('/tourguides/:id', async (req, res) => {
            const id = req.params.id;
            const options = {
                projection: {}
            };
            const query = { _id: new ObjectId(id) };
            const result = await TourGuideCollection.findOne(query);
            res.send(result);
        })

        app.get('/tourguides', async (req, res) => {
            const cursor = TourGuideCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        })
        // find multiple data based on type
        app.get('/place/:type', async (req, res) => {
            const targetType = req.params.type;
            const cursor = TravelPlaceCollection.find({ type: targetType });
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })
        //post  user information
        app.post('/Users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await UserCollection.insertOne(newUser);
            res.send(result);
        })
        // get user information
        // app.get('/Users', async (req, res) => {
        //     const cursor = UserCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })
        app.get('/Users/:email', async (req, res) => {
            const email = req.query?.Email;
            const query = { email };
            console.log(query);
            const result = await UserCollection.findOne(query);
            res.send(result);
        })
        //post wishilist
        app.post('/mywishlist', async (req, res) => {
            const newWishlist = req.body;
            console.log(newWishlist);
            const result = await WishlistCollection.insertOne(newWishlist);
            res.send(result);
        })
        // get wishlist
        app.get('/mywishlist', async (req, res) => {
            const cursor = WishlistCollection.find();
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