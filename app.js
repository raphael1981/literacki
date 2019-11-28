const express = require('express');
const app = module.exports = express();
const bodyParser = require('body-parser')
const path = require('path');
const cookieParser = require('cookie-parser');
const pug = require('pug');
const authmiddleware = require('./middlewares/admin/authmiddleware')

require('zone.js/dist/zone-node');
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine;
const { ServerAppModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.js');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

const provider = provideModuleMap(LAZY_MODULE_MAP);

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: ServerAppModuleNgFactory,
    providers: [provider]
  })
);

app.use(cookieParser())

app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function (req, res, next) {
  //res.setHeader("Cache-Control", "max-age=31556926");
  res.setHeader("Cache-Control", 'no-cache, no-store, must-revalidate');
  return next();
});

app.use(express.static('static', {
  maxage: false,
  etag: false
}))

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug')
// app.set('tmpDir', path.join(__dirname, 'tmp'));ow

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: ServerAppModuleNgFactory,
    providers: [provider]
  })
);

app.set('view engine', 'html');
app.set('view engine', 'pug')
app.set('views', __dirname);

app.use(express.static(__dirname + '/assets', { index: false }));
app.use(express.static(__dirname + '/dist/browser', { index: false }));


app.get('/wyszukiwanie', (req, res) => {
  return res.render('./dist/browser/index.html', {
    req: req,
    res: res
  });
});


// if (app.get('env') === 'development') {
//     console.log(app.get('env'))
//     app.use(express.errorHandler());
// }

app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


const authRoutes = require('./auth-routes');
const webRoutes = require('./web-routes');
const apiRoutes = require('./api-routes');

app.use('/api', authRoutes);
app.use('/api', authmiddleware, apiRoutes);
app.use('/', webRoutes);



app.listen(3000, () => {
  console.log('Start app')
});