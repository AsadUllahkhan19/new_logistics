require('dotenv').config()
require('./config/db');
const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const trade = require('./routes/trade')
const morgan = require('morgan')
const app = express();
const yaml = require('yamljs')
const swaggerJsdoc = yaml.load('./config/swagger.yaml')
const swaggerUI = require('swagger-ui-express')
const {errorHandler} = require('./handler/errorHandler')


app.use('/api/docs',swaggerUI.serve,swaggerUI.setup(swaggerJsdoc))
app.set('view engine','ejs')
app.use(morgan('dev'))
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/users', users);
app.use('/trade', trade);
app.get('/test', (req, res) => {
    res.send('Hello ibbi');
  });
app.use(errorHandler)
console.log(process.env.WEBSITE_LINK)
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));