require('dotenv').config();
let cronJobs = require('../utilitys/cronJobs'),
    mongoose = require("mongoose");

mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(async () => {
	console.log("MongoDB has concected!");
    cronJobs.dayCron();
}).catch((err) => {
	console.log("Something went wrong");
	console.log(err.message);
});
