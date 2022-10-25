const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 5000

const app = express()

// app.use(function (request, response, next) {
//   if (process.env.NODE_ENV != 'development' && !request.secure) {
//     return response.redirect("https://" + request.headers.host + request.url);
//   }
//   next();
// })

app.use(history())
app.use(serveStatic(__dirname + '/dist/spa'))
app.listen(port)
