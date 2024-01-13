const app = require("./app");
const { connectToMongo } = require("./services/connectToMDB");
require("dotenv").config();


connectToMongo().catch((err) => {
    console.error(err);
});
app.listen(process.env.PORT, ()=>{
    console.log("server started on the " + process.env.PORT + " PORT")
})