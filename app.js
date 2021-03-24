var express = require("express"),
app = express();

//ENV setup
require('dotenv').config();

//Declaring varibles
var bodyParser = require("body-parser"),
	passportSetup = require("./config/passport-setup"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	User = require("./models/users"),
	expressSession = require("express-session"),
	cronJobs = require('./utilitys/cronJobs'),
	dealRoutes = require('./routs/deals'),
	cors = require('./config/cors');

//passport setup
cors(app);
app.use(expressSession({
	secret: "Login app",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(user, done) {
 	done(null, user);
});

//app.use
app.use((req, res, next) => {
	//populate req.app.loacls with app info
	req.app.locals.currentUser = req.user;

	next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

//connecting mongoose
mongoose.connect(process.env.DBURL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(async () => {
	console.log("MongoDB has concected!");
	//cronJobs.dayCron();
	//Remove all users
	/*User.remove({}, (err) => {
		if(err){
			console.log("Something went wrong");
			console.log(err.message);
		}
		else{
			console.log("all users have been deleted");
			User.find({}, (err, users) => {
				console.log(users);
			});
		}
	});*/

}).catch((err) => {
	console.log("Something went wrong");
	console.log(err.message);
});


//Allow commands
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (text) {
	if (text.trim() === 'run_day_cron') {
		cronJobs.dayCron();
	}
  if (text.trim() === 'quit') {
    done();
  }
});

function done() {
  console.log('Now that process.stdin is paused, there is nothing more to do.');
  process.exit();
}

//Handling routs
//route file locations
var authenticationRouts = require("./routs/authentication"),
	indexRouts = require("./routs/index");
//using routs files
app.use(authenticationRouts);
app.use(indexRouts);
app.use('/deals', dealRoutes);

//app setings
app.set("view engine", "ejs");

app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log(`Server has started on ${process.env.PORT}!`);
});