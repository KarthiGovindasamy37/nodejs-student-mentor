const express=require("express")
const app=express()
const mongodb=require("mongodb")
const mongoclient=mongodb.MongoClient
const dotenv=require("dotenv").config()

let URL=process.env.URL
let DB=process.env.DB

app.use(express.json())


app.post("/createstudent",async(req,res)=>{
    try {
        
        let connection=await mongoclient.connect(URL);

        let db=connection.db(DB);

        await db.collection("student").insertOne(req.body);

        await connection.close();

        res.json({message:"Student created"});
    } catch (error) {
        res.status(500).json({message:"Somethig went wrong,try again"})
    }
})

app.post("/creatementor",async(req,res)=>{
    try {
        
        let connection=await mongoclient.connect(URL);

        let db=connection.db(DB);

        await db.collection("mentor").insertOne(req.body);

        await connection.close();

        res.json({message:"Mentor created"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong,try again"})
    }
})


app.put("/assignmentor/:id",async(req,res)=>{
    try {
        let connection=await mongoclient.connect(URL);

        let db=connection.db(DB);

        await db.collection("student").findOneAndUpdate({stid:req.params.id},{$set:req.body})

        await connection.close();

        res.json({message:"Mentor assigned"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong,try again"})
    }
})

app.put("/assignstudent/:id",async(req,res)=>{
    try {
        
        let connection= await mongoclient.connect(URL);

        let db=connection.db(DB);

        let available=await db.collection("student").findOne({$and:[{stid:req.body.studentid},{mentor:{$exists:false}}]})
        
        if(available){
        await db.collection("mentor").findOneAndUpdate({mtid:req.params.id},{$push:{students:req.body.studentid}})

        await connection.close();

        res.json({message:"Student added"});
        }else{
            res.json({message:"Student already has a mentor"})
        }
    } catch (error) {

        res.status(500).json({messsage:"Something went wrong,try again"})
    }
})

app.get("/mentor/:id",async(req,res)=>{
    try {
        
        let connection=await mongoclient.connect(URL);

        let db=connection.db(DB);

        let students=await db.collection("student").find({mentor:req.params.id},{name : 0,stid : 0}).toArray();

        await connection.close();

        res.json(students);
    } catch (error) {
        res.status(500).json({message:"Something went wrong,try again"});
    }
})






app.listen(process.env.PORT || 3000)