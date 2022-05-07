const express=require('express');
const cors=require('cors')

const app=express();
app.use(cors());

const port=process.env.PORT || 8080;

app.get('/', (req,res)=>{
    res.send('Te-ai ajuns faci site-uri')
});

app.listen(port, () =>{
    console.log(`Cloud computing app listen on port ${port}!`)
});