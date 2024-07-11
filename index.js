import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express(), port = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", async (req, res) => {
    try{
        const response = await axios.get("https://bored-api.appbrewery.com/random");
        console.log(`Response from Public Bored API : ${response.data.activity} , ${response.data.type}`);
        res.render("index.ejs", {data : response.data});
    }
    catch(error){
        if(error === "AxiosError: Request failed with status code 429"){
            res.send("Too many Request. Please try again after sometime");
        
        console.log(`error:${error}`);
        console.error(`Failed to make a request: ${error.message}`);
        res.status(500).send(`Failed to fetch the activity. Please try again later`);
    }
}
});

app.post("/go", async (req, res)=>{
    console.log(`post section : ${req.body.randomType}`);
    console.log(`post section : ${req.body.participants}`);
    try{
        const url = `https://bored-api.appbrewery.com/filter?type=${req.body.randomType}&participants=${req.body.participants}`;
        console.log(`url : ${url}`);
        const response = await axios.get(url);
        console.log(`length:${response.data.length}`);
        res.render("index.ejs", {data : response.data[Math.floor(Math.random()*response.data.length)]});
    }
    catch(error){
        if(error.response){
            if(error.response.data.error === "Activities not found for the given filter."){
                res.render("index.ejs", {data : {
                    activity : "Activities not found for the given filter.",
                    type : req.body.randomType,
                    participants : req.body.participants
                }});
            }
        }
    }

})

app.listen(port, () => {
   console.log(`Listening to port ${port}`);
});