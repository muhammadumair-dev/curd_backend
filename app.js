import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import cors from 'cors'
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors())
app.use(express.json());
app.get("/", (req, res) => {
  const read = fs.readFileSync("user.txt", "utf-8");
  res.json(JSON.parse(read));
});
app.post("/createuser", (req, res) => {
  const body = req.body;

for (let key in body) {
  if (body[key] === "") {
    res.json(`${key} empty hai`);
  }
}
  const existfile = fs.existsSync("user.txt");
  if (existfile) {

    const read = fs.readFileSync("user.txt", "utf-8");

    const userData = JSON.parse(read);

   const user = userData.find((e) => e.email === body.email);
   if (user) {
    return res.json({message:"already signup"})
   }
    userData.push({
      ...body,
      id: uuidv4(),
    });

    fs.writeFileSync("user.txt", JSON.stringify(userData));

    return res.json("User Created");  

  
    
  } 
  else {
    const arr = [];
    arr.push({ ...body, id: uuidv4() });
    fs.writeFileSync("user.txt", JSON.stringify(arr));
  }
  res.json("hi");
});
app.post("/login", (req, res) => {
  const body = req.body;

const getData = fs.readFileSync("user.txt", "utf-8");
  const par = JSON.parse(getData);




const user= par.find((e) => e.email === body.email && e.password === body.password);
 if (user) {
        res.json({
            success: true,
            user: user
        });
    } else {
        res.json({
            success: false,
            message: "Invalid Email or Password"
        });
    }





});
app.post("/updateuser/:id", (req, res) => {
  const params = req.params;
  const getData = fs.readFileSync("user.txt", "utf-8");
  const par = JSON.parse(getData);



  const newarr = par.map((e) => {
    if (e.id === params.id) {
      return req.body;
    } else {
      return e;
    }
  });

  


  fs.writeFileSync("user.txt", JSON.stringify(newarr));


  res.json("updae");
});
app.post("/deleteuser/:id", (req, res) => {
const params = req.params;
  const getData = fs.readFileSync("user.txt", "utf-8");
  const par = JSON.parse(getData);
 const ind= par.findIndex((e)=>e.id === params.id)
 par.splice(ind,1)

  fs.writeFileSync("user.txt", JSON.stringify(par));



 res.json('USER DELETED')
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
