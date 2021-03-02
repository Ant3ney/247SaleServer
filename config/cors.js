let whitelist = require('./orginWhitelist');

module.exports =  function configure(app){
    

    app.use(async (req, res, next) => {
        var host = await req.headers.origin;
        console.log('host: ' + host);
        let origin = '';
        console.log('origin: ' + host);
        //populate req.app.loacls with app info
        req.app.locals.currentUser = req.user;
    
        res.setHeader('Access-Control-Allow-Origin', host);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}