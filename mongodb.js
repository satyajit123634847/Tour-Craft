
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://EV:Mahi123@cluster0.tadgngw.mongodb.net/vendor-register?retryWrites=true&w=majority")
  .then(() => {
    console.log('Database connected');
    // Perform additional operations after successful connection
  })
  .catch((error) => {
    console.log('Error while connecting to the database:', error);
    // Handle the connection error appropriately
  });
