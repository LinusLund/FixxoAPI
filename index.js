require('dotenv').config()
const express = require('express');
const cors  = require('cors');
const mongodb = require('./mongodb_server')
const exphbs = require('express-handlebars');
const products = require('./schemas/productSchema');
const PORT = process.env.API_WEBSERVER || 9999;
const path = require('path');







const app = express();

// Cors middleware
app.use(cors());

// Handlebars Middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');



// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//static för att kunna styla APIet med css
app.use(express.static(path.join(__dirname, 'public')));

// Homepage Route
app.get('/', (req, res) =>
  res.render('index', {
   title: 'PRODUCT VIEWER',
   products
  })
);




// products API Routes
app.use('/api/products/details', require('./controllers/API/productController'));
app.use('/api/products', require('./controllers/API/productController'));
app.use('/', require('./controllers/API/productController'));

//initialize
mongodb()
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
