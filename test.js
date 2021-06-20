require('./db');
const { Order, ShopCart, Product, ProductCategory } = require('./models');

// ShopCart.find({}).select('product quantity')
//   .then(res => {
//     // console.log(res)
//     Product.find({_id: {
//       $in: ['5c98804037e89d136c366d9d', '5c94dee52994220dce44b11c']
//     }})
//     .then(d => {
//       console.log(d)
//     })
//   })

// Product.find({})
//   .populate('productCategory')
//   .limit(1)
//   .sort({ _id: -1 })
//   .then(r => console.log(r));

const mongoose = require('mongoose');
// console.log(new mongoose.Types.ObjectId('5c8217cb6320a0b9140846a7'));
Product.find({
  productCategory: '5c8212497283631e28ae6087',
}).then(res => console.log(res));
