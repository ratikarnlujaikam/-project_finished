const express = require("express");
const cors = require('cors');
const usersRouter = require('./routers/users');
const productsRouter = require('./routers/products');
const orderRouter = require('./routers/order');
const reportRouter = require('./routers/report');
const app = express();
const port = 8000;



//parse url-encoded bodies (at sent by html form)
app.use(express.urlencoded({ extended: false }));
//parse json bodies (at sent by html form)
app.use(express.json());

app.use(cors());


//define router
app.use('/products', productsRouter);
app.use('/order', orderRouter);
app.use('/sales', reportRouter);


// Start the server on port 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});