const express = require('express');
const cors=require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());


const port = 5000;
// mongodb username and password  => userName:- myDbuser1, RSk1L7DKGjG88eyC

// ক্লাইন্ট বানানোর জন্য username password দিয়ে uri বানানো হচ্ছে
const uri = "mongodb+srv://myDbuser1:RSk1L7DKGjG88eyC@cluster0.rtxhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//uri পাঠিয়ে  MongoClient class থেকে  client তৈরি করা  হচ্ছে 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





 
async function run() {
    try {
        // ডাটাবেজ এর সাথে client  connenct করা হচ্ছে
        await client.connect();

        // client profile e database এর নাম দেয়া হচ্ছে
        const database = client.db('jhankermahbub')

        // database এর মদ্ধে user তৈরি করা হচ্ছে
        const userCollection = database.collection('karinakaiser')
     
        app.get('/',(req, res) => {
            res.send('successfully workd')
        })

        // GET API  ডাটাবেজ থেকে পাঠানো হচ্ছে ক্লাইন্ট সাইট এ 
        app.get('/users', async (req, res) => {
            // userCollection এ গিয়ে বাটিতে নিচ্ছে 
            const cursor = userCollection.find({});
            // Array  পেকেট এ ভরছে
            const users = await cursor.toArray();
            // পাঠিয়ে দেয়া হচ্ছে 
            res.send(users)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);

        
       })

        
        // POST API  ডাটাবেজ এ রাখে হচ্ছে ক্লাইন্ট সাইট থেকে 
        app.post('/users', async (req, res) => {
            // req থেকে ডাটা নিচ্ছে
            const newUser = req.body;
            // user এ  Data রেখে দেয়া হচ্ছে
            const result = await userCollection.insertOne(newUser);
            // কনসল লগ করা হচ্ছে 
            console.log('I accept your user', result);
            // data রাখা হলে successfull হিসেবে যেই object আসবে তাকে response হিসেবে পাঠিয়ে দেয়া হচ্ছে
            res.json(result)
        });
            


        
        
        // delete request accept করে ডাটাবেজ থেকে ডিলিট করে দেয়া হচ্ছে 
        // delete request গোপন যায়গায় বসে নেয়া হয় যেমন যাকে ডিলিত করতে চায় তাঁর আইডি রাউট দিয়ে গোপন যায়গায় ঢুকতে হবে 
        app.delete('/users/:id', async (req, res) => {
            // route  এ যেই আইডি ডিলিট হতে  আসছিলো তাকে নেয়া হচ্ছে 
            const id = req.params.id;
            // ডাটাবেজ থেকে ডিলিট করার আগে অবজেক্ট বানিয়ে key দিতে হবে _id এবং value  দিতে হবে ডাটাবেজ এর ফাংশন ObjectId ke কল করে যেই আইডি ডিলিট হতে আসছিলো তাকে  পেরামিটার হিসেবে দিয়ে দেয়া ObjectID(id)
            const query = { _id: ObjectId(id) };
            // userCollection এর পরে ডট দিয়ে deleteOne function ke call  করে উপরের ডিলিটের জন্য বানানো   অবজেক্ট পেরামিটার হিসেবে পাঠিয়ে দিতে হবে 
            const result = await userCollection.deleteOne(query);
            console.log(` deleting id is`, result);
            
            // deleleteOne function succesfull হলে একটা  অবজেক্ট রিটার্ণ করে সেইটা  response হিসেবে পাঠিয়ে দিতে হবে যাতে client site   থেকে বুঝতে পারে delete  করা হয়ে গেছে 
            res.json(result)
        });
    }
    
    
    finally {
        // await client.close();

    }



}
run().catch(console.dir);






app.listen(port, () => {
    console.log('running my cruid server on port', port);
})







