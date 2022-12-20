const express = require('express');
const productSchema = require('../../schemas/productSchema');
const controller = express.Router();
const products = require('../../schemas/productSchema')


//Hämta alla produkter
controller.route('/').get(async (req, res) => {
    const products = []
    const list = await productSchema.find()

    if(list) {
        for(let product of list) {
            products.push({
                articleNumber: product._id,
                name:product.name,
                description:product.description ,
                price:product.price ,
                category:product.category ,
                tag:product.tag ,
                imageName:product.imageName ,
                rating: product.rating
            })
        }
    
        res.status(200).json(products)
    }else
        res.status(400).json()
 })

 //Hämta alla produkter med angiven tag 
controller.route('/:tag').get(async (req, res) => {
    const products = await productSchema.find({tag: req.params.tag})

    if(products)
        res.status(200).json(products)
    else
        res.status(400).json()
 })

//hämtar X-antal av den angivna taggen
 controller.route('/:tag/:take').get(async (req,res) => {
    const products = []
    const list = await productSchema.find({tag: req.params.tag}).limit(req.params.take)
    if(list) {
        for(let product of list) {
            products.push ({                
                articleNumber: product._id,
                name:product.name,
                description:product.description ,
                price:product.price ,
                category:product.category ,
                tag:product.tag ,
                imageName:product.imageName ,
                rating: product.rating
            })
        }
    
        res.status(200).json(products)
    } else
        res.status(400).json()
 })

 //Hämta en specifik produkt
 controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    if(product) {
        res.status(200).json({                
            articleNumber: product._id,
            name:product.name,
            description:product.description,
            price:product.price ,
            category:product.category,
            tag:product.tag,
            imageName:product.imageName,
            rating: product.rating
        })
    } else
        res.status(400).json()
 })

//Lägga till en Produkt
 controller.route('/api/products').post(async(req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if(!name || !price)
        res.status(400).json({text:'name and price is required'})

    const itemExists = await productSchema.findOne({name})
    if(itemExists)
        res.status(409).json({text:'a product with the same name already exists'})
    else {
        const product = await productSchema.create({
            name,
            description,
            price,
            category,
            tag,
            imageName,
            rating
        })
        if(product)
           res.status(201).json(product)
        else
            res.status(400).json({text:'Something went wrong'})
    }
 })


//Ta bort en Produkt
 controller.route('/api/products').delete(async(req, res) => {
    const { name } = req.body

    if(!name)
        res.status(400).json({text:'name is required'})

    const itemExists = await productSchema.findOne({name})
    if(!itemExists)
        res.status(409).json({text:'a product with the that name doesnt exist'})
    else {
        const product = await productSchema.deleteOne({
            name
        })
        if(product)
           res.status(202).json(product)
        else
            res.status(400).json({text:'Something went wrong'})
    }
 })
//Uppdatera en Produkt
controller.route('/product/details/:articleNumber').put(async (req, res) => {    
    
        const { name, description,price,category,tag,imageName,rating } = req.body


    const itemExists = await productSchema.findOne({name})

    if(itemExists)
        res.status(409).json({text:'a product with that name already exist'})

    else{
        const updateProduct = await productSchema.findById(req.params.articleNumber)

        await productSchema.findByIdAndUpdate(updateProduct, {$set:itemExists, name, description, price, category, tag, imageName, rating} )

        res.status(201).json({msg: `Product with articlenumber ${req.params.articleNumber} has been updated`})
        }
})

// controller.route('/:tag/:take').get((req, res) => {
// 	let list = []

// 	for (let i=0; i< req.params.take; i++)
// 		list.push(req.products[i])
	
//         res.status(200).json(list)
//         console.log(list)
// })



// // //hämta en produkt samt meddela ifall IDt inte finns
// controller.get('/details/:_id', (req, res) => {

//     const found = products.some(products => products._id ===(req.params.id))
//     if(found) {

//     } else {
//         res.status(400).json({ msg: `No Product with the ID of ${req.params.id}` });
//     }

//     res.json(products.filter(products => products.id ===(req.params.id)));
// })

// //skapa ny Produkt
// controller.post('/', (req, res) => {
//     const newProduct = {
//         articleNumber: uuid.v4(),
//         name: req.body.name,
//         price: req.body.price,
//         category: req.body.category,
//         imageName: req.body.imageName,
        
//     };
//     if(!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.imageName) {
//        return res.status(400).json({msg: 'please enter info in every area'})
//     }

    
//     ProductSchema.push(newProduct);
//     res.json(ProductSchema);
// });

// //uppdatera produkt
// controller.put('/details/:articleNumber', (req, res) => {

//     const found = ProductSchema.some(ProductSchema => ProductSchema.articleNumber === parseInt(req.params.articleNumber))
//         if(found) {
//             const updProduct = req.body;
//             ProductSchema.forEach(ProductSchema => {
//                 if(ProductSchema.articleNumber === parseInt(req.params.articleNumber)) {
//                     ProductSchema.name = updProduct.name ? updProduct.name : ProductSchema.name;
//                     ProductSchema.price = updProduct.price ? updProduct.price : ProductSchema.price;
//                     ProductSchema.category = updProduct.category ? updProduct.category : ProductSchema.category;
//                     ProductSchema.imageName = updProduct.imageName ? updProduct.imageName : ProductSchema.imageName;

//                     res.json({ msg: 'Product updated', ProductSchema});
//                 }
//             });
//         } else {
//             res.status(400).json({ msg: `No Product with the ID of ${req.params.articleNumber}` });
//     }
// });

// //Radera produkt
// controller.delete('/details/:articleNumber', (req, res) => {

//     const found = ProductSchema.some(ProductSchema => ProductSchema.articleNumber === parseInt(req.params.articleNumber))
//         if(found) {
//             res.json({ msg: 'Product deleted',
//              ProductSchema: ProductSchema.filter(ProductSchema => ProductSchema.articleNumber !== parseInt(req.params.articleNumber))
//         });
//             } else {
//                 res.status(400).json({ msg: `No Product with the ID of ${req.params.articleNumber}` });
//         }
//     });
 



module.exports = controller;