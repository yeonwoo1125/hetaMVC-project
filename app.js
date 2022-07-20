const express = require('express');
const bodyParser = require("body-parser");
const appConfig = require("./app.config");
const path = require('path');
const app = express();

const app_route = path.resolve(__dirname, './src/backend');
app.engine('.html', require('ejs').__express);
app.set('views', path.resolve(app_route,'views'))
app.set('view engine','.html');

app.use(bodyParser.json({limit : '50mb'}));
app.use(express.json());
app.use(bodyParser.urlencoded({limit:'50mb', extended : false}));

app.use(function(err, req, res, next){
    if (err.status === 404){
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    }
    else next(err);
});

const serv = require('http').Server(app);
serv.listen(appConfig._port, (err) => {
    if (err) {
        return console.log(err)
    }

    return console.log('server is listening on http://localhost:%s/', appConfig._port);
});

require('hetamvc').init({
    scanPath:app_route,	//path
    route:app,		//express route
},{
    babel_plugin: ["module-resolver",{"alias": {"@": "./"}}]
});
