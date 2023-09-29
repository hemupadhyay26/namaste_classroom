const express = require('express')
const PORT = 4000;

require('dotenv').config()

require('./db/conn')
require('./models/User')

const app = express();
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const requireToken =  require('./middleware/auth')

app.use(bodyParser.json());
app.use(authRoutes);

app.get('/',requireToken, (req, res) => {
    res.send('welcome');
})

app.listen(PORT,()=>{
    console.log('listening on port ' + PORT);
})