require('dotenv').config()
require('./config/db');
const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const trade = require('./routes/trade')
const app = express();


// app.use('/api/docs',swaggerUI.serve,swaggerUI.setup(swaggerJsdoc))
app.use(cors('*'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello ibbi');
});

app.use('/users', users);
app.use('/trade', trade);

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Server running on port ${port}`));