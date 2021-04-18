const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h25va.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)


const port = 5000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("ornaments").collection("service");
  const ornamentCollection = client.db("ornaments").collection("products");
  const reviewCollection = client.db("ornaments").collection("review");
  const adminCollection = client.db("ornaments").collection("admin");

  app.post('/addService', (req, res) => {
    const service = req.body
    serviceCollection.insertOne(service)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrnaments', (req, res) => {
    const ornament = req.body
    ornamentCollection.insertOne(ornament)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/bookingList', (req, res) => {
    console.log(req.query.email)
    ornamentCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/allBookingList', (req, res) => {
    ornamentCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addReview', (req, res) => {
    const review = req.body
    reviewCollection.insertOne(review)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviewList', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addAdmin', (req, res) => {
    const admin = req.body
    adminCollection.insertOne(admin)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email
    adminCollection.find({email: email})
      .toArray((err, admin) => {
        res.send(admin.length > 0)
        console.log(admin)
      })
  })

});


app.listen(port)