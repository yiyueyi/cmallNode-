const axios = require("axios").default;
const fs = require("fs");

/**
 * 为小程序云开发生成可以导入的数据
 *  JSON 数据不是数组，而是类似 JSON Lines，即各个记录对象之间使用 \n 分隔，而非逗号；
 */
function writeDataForWXYunDev() {
  axios
    .get(
      "https://o2api.jd.com/data?body=%7B%22query%22%3A%22query%20getCommodities(%24ids%3A%20String)%7Bcommodities(ids%3A%20%24ids)%7BgroupId%2C%20groupName%2C%20productList%7BcanSell%20skuId%20name%20image%20commentCount%20goodRate%20jdPrice%20pcpPrice%20plusPrice%20tag%20copyWriting%20copyWritingDown%20backUpWords%7D%7D%7D%22%2C%22operationName%22%3A%22getCommodities%22%2C%22variables%22%3A%7B%22ids%22%3A%22%5B03504985%2C03505081%5D%22%7D%2C%22config%22%3A%7B%22cache%22%3Afalse%2C%22trim%22%3Atrue%2C%22map%22%3A%7B%22keyBy%22%3A%22groupId%22%2C%22valueField%22%3A%22productList%22%7D%7D%7D&_=1568689310891",
      {}
    )
    .then(res => {
      console.log(res.data.data["03504985"]);
      let products = [];
      res.data.data["03504985"].forEach(p => {
        var temP = {};
        temP._id = Math.floor(Date.now() * Math.random() * 10000).toString();
        temP.name = p.name;
        temP.descriptions = p.name;
        temP.price = p.jdPrice * 1;
        temP.coverImg = p.image;
        products.push(JSON.stringify(temP));
      });
      //   console.log(products);
      // console.log("插入成功");
      fs.writeFileSync("./jd.json", products.join("\n"));
    });
}

const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    descriptions: {
      type: String
    },
    onSale: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ""
    },
    quantity: {
      type: Number,
      default: 10
    },
    price: {
      type: Number,
      default: 0.0
    },
    coverImg: {
      type: String
    },
    productCategory: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "ProductCategory"
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

mongoose.connect("mongodb://localhost:27017/cat-shop").then(res => {
  console.log(res);
  Product.find({})
    .sort({ _id: -1 })
    .then(res => console.log(res));

  var products = [];
  axios
    .get(
      "https://o2api.jd.com/data?body=%7B%22query%22%3A%22query%20getCommodities(%24ids%3A%20String)%7Bcommodities(ids%3A%20%24ids)%7BgroupId%2C%20groupName%2C%20productList%7BcanSell%20skuId%20name%20image%20commentCount%20goodRate%20jdPrice%20pcpPrice%20plusPrice%20tag%20copyWriting%20copyWritingDown%20backUpWords%7D%7D%7D%22%2C%22operationName%22%3A%22getCommodities%22%2C%22variables%22%3A%7B%22ids%22%3A%22%5B03504985%2C03505081%5D%22%7D%2C%22config%22%3A%7B%22cache%22%3Afalse%2C%22trim%22%3Atrue%2C%22map%22%3A%7B%22keyBy%22%3A%22groupId%22%2C%22valueField%22%3A%22productList%22%7D%7D%7D&_=1568689310891",
      {}
    )
    .then(res => {
      console.log(res.data.data["03504985"]);
      res.data.data["03504985"].forEach(p => {
        var temP = {};
        temP.name = p.name;
        temP.descriptions = p.name;
        temP.price = p.jdPrice * 1;
        temP.coverImg = p.image;
        products.push(temP);
      });
      //   console.log(products);
      Product.insertMany(products);
      console.log("插入成功");
    });
});
