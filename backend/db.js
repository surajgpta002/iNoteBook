const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectTOMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log('coonnection has been done');
        })
        .catch((err) => {
            console.log('coonection is lost');
        })

}



module.exports = connectTOMongo;