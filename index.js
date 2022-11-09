const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectID } = require('bson');

require('dotenv').config();

const port = process.env.PORT || 6600;
//user4
//GbEKGg8umBaVNZMk
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pqymyou.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){

    try{
        const serviceCollection = client.db('Doctor').collection('services');

        const reviewCollection = client.db("Doctor").collection("reviews");
        app.get('/reviews', async(req, res) =>{
            let query = {};
            if(req.query.email){
                query = {
                  email: req.query.email
                };
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);

        })
        app.post("/reviews", async (req, res) => {
          const review = req.body;
          const result = await reviewCollection.insertOne(review);
          res.send(result);
        });

       app.get('/services', async(req, res) =>{
        const query ={};
        const cursor = serviceCollection.find(query);
        const services = await cursor.limit(3).toArray();
        res.send(services);
       });
       app.get("/servicesAll", async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query);
         const services = await cursor.toArray();
         res.send(services);
       });

       app.get('/services/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectID(id) };
         const service = await serviceCollection.findOne(query);
         res.send(service);
       });

       
       
    }
    finally{

    }
    
}
run().catch((error) => console.error(error));



app.get('/', (req, res) =>{
    res.send('doctor server in running')
})

app.listen(port, () =>{
    console.log(`server running on ${port}`);
})