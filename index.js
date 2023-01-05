const express = require('express');
const app = express();
const {myFunction} = require('./services/jsontopdf.js')



const port = 3000;
app.listen(port,()=>{
    console.log(`post listing on ${port}`)
})
app.get('/',(req,res)=>{
res.send('hellow world')
})

app.post('/test',myFunction)
// app.use('/',userController)
