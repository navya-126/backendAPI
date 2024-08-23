const express = require('express')
const app = express()
const path = require('path') 
const cors=require("cors")

const PORT=3000
app.use(express.json())
app.use(cors())


const {open} = require('sqlite')
const sqlite3 = require('sqlite3')


const dbpath = path.join(__dirname, 'document.db')

let db = null

const initalizeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log('Server is running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error ${e.message}`)
    process.exit(1)
  }
}

initalizeDBAndServer()


app.post("/bookings",async (request,response)=>{
    const {dateTime,price} = request.body
    const createDocu=`INSERT INTO booking(date_time,price)VALUES(
    "${dateTime}",${price}
    );`;
    const DBdata= await db.run(createDocu);
    response.status(200).json({message:"Booking Created Successfully",id:DBdata.lastID})
})

app.get("/mentors",async (request,response)=>{
  const {areaOfInterest=""} = request.query
  console.log(areaOfInterest)
    const fetchDocu=`SELECT name FROM mentor WHERE areas_of_expertise LIKE "%${areaOfInterest}%" ;`;
    const rows= await db.all(fetchDocu);
    response.status(200).json(rows)
})

app.get("/mentors/roles",async (request,response)=>{
  const {name} = request.query
  console.log(name)
    const fetchDocu=`SELECT areas_of_expertise FROM mentor WHERE name="${name}" ;`;
    const rows= await db.all(fetchDocu);
    response.status(200).json(rows)
})



app.get("/bookings",async (request,response)=>{
    const fetchDocu=`SELECT * FROM booking;`;
    const rows= await db.all(fetchDocu);
    response.status(200).json(rows)
})

app.post("/students",async (request,response)=>{
  const {name,availability,areaOfInterest} = request.body
    const createDocu=`INSERT INTO student(name,availability,area_of_interest)VALUES(
    "${name}",${availability},'${areaOfInterest}'
    );`;
    const DBdata= await db.run(createDocu);
    response.status(200).json({message:"Student Created Successfully",id:DBdata.lastID})
})

app.get("/students",async (request,response)=>{
  const fetchDocu=`SELECT * FROM student;`;
  const rows= await db.all(fetchDocu);
  response.status(200).json(rows)
})

app.get("/",async (request,response)=>{
    response.send("Welcome to CareerCarve Assignment")
})