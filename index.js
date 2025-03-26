import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { error } from "console";
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.render('index.ejs',{message: "wellcome "});
});

app.post('/adduser', async (req,res)=>{
    const {username, userpws} = req.body;
    if(!username || !userpws){
        return res.status(400).render('index.ejs', {
            message: "Please input Both of the fields!"
        });
    };
    try{
        const adduser = await axios.post("http://localhost:3011/adduser",
            {
                username: username, 
                userpws: userpws
            });
        console.log(adduser);
        res.status(200).render('index.ejs', { message: "User added successfully!" });
    }catch(err){
        console.error({error: "can't add user: ", err});
        return res.status(500).render('index.ejs', { message: "Username already taken!" });
    }
});

app.post('/userlogin', async (req,res)=>{
    const { username, userpws } = req.body;
    if (!username || !userpws) {
        return res.status(400).render('index.ejs', {
            message: "Please input Both of the fields!"
        });
    };
    try{
        const getuser = await axios.post("http://localhost:3011/userlogin",{
            username: username,
            userpws : userpws
        })
        if (getuser.data) {
            return res.status(200).render('index.ejs', { message: `Welcome, ${username}!` });
        } else {
            return res.status(401).render('index.ejs', { message: "Incorrect username or password!" });
        }
    } catch (err) {
        console.error("Internal error during login:", err.message);
        return res.status(500).render('index.ejs', { message: "Incorrect username or password!" });
    }
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});