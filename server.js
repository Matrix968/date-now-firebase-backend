import express from "express";
import admin from "./firebase.js";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "email, password and name required" });
    }
    const userRecord = await admin.auth().createUser({
      password,
      email,
      displayName: name,
    });
    res.status(200).json({
      message: "user created successfully",
      uid: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email,
      password: userRecord.passwordHash
    })
  } catch (error){
    console.error(error);
    res.status(400).json({error: error.message})
  }
});

const API = 3000
app.listen( API, ()=>{
  console.log(`server is running on port http://localhost:${API}`)
})


app.get("/users", async(req, res) =>{
  const listUsers = await admin.auth().listUsers(1000);
  const users = listUsers.users.map(user =>({
    name: user.displayName,
    email: user.email,
    password: user.passwordHash,
    uid: user.uid
  }))

})