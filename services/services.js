const Product = require("../models/Product")
const {fakerDE: faker} = require("@faker-js/faker");
// const faker = Faker.en_IN;


exports.createProducts = async (nop) => {
    const colors = ["#eda6c2", "#debbdd", "#1dfaa0", "#84ec57", "dbb3f7", "#ec5d9e", "#f80c0d", "#dadce4"];
    try{
       const products = [];
        for (let i = 0; i < nop; i++) {
            const randomNumber = Math.floor(Math.random() * 5);
            const uniqueRandomNumbers = generateUniqueRandomNumbers(0, 7, 4)
            const newProduct = {
                title:faker.commerce.productName(),
                description:faker.commerce.productDescription(),
                stock:faker.number.int({min: 2, max:20}),
                price:faker.number.int({min:40, max:1000}),
                discount:faker.number.int({min:0, max:70}),
                colors:[colors[uniqueRandomNumbers[0]], colors[uniqueRandomNumbers[1]], colors[uniqueRandomNumbers[2]], colors[uniqueRandomNumbers[3]]],
                sold:faker.number.int({min:0, max:200}),
                thumbnail:faker.image.url(category="bike"),
                images:[faker.image.url(category="bike"), faker.image.url(category="bike"), faker.image.url(category="bike"), faker.image.url(category="bike")],
                type:["road", "mountain", "bmx", "city", "kids"][randomNumber],
                brand:["bianchi", "bmc", "trek", "hero", "avon"][randomNumber],
                productUserId:"6598fc0fa0eeab7239967dcf",
                specs:{
                    frameSize:["S", "M", "L", "XL"], 
                    wheelSize:["17", "18", "20", "22", "24", "26"], 
                    class:"City", 
                    nos:[7, 8, 9, 10, 11][randomNumber], 
                    cr:["INDIA", "USA", "UK", "UAE"][randomNumber]
                },
                rating: faker.number.int({min:0, max:4000})
            };

            products.push(newProduct)
        }
        await Product.create(products);
        console.log("Product created successfully")
    }catch(err){
        console.log(err)
    }
}

// Function to generate unique random numbers within a range
function generateUniqueRandomNumbers(min, max, count) {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < count) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      uniqueNumbers.add(randomNumber);
    }
    return Array.from(uniqueNumbers);
  }