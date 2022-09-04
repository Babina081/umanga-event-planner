//importing mongoose
const mongoose = require('mongoose');

//function for connecting to database
const connectDatabase = () => {
  //for connecting to mongodb
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });

  //As we have resolved the problem by calling the unhandled rejection function
  /*.catch((err) => {
      console.log(err);
    });*/
};

module.exports = connectDatabase;
