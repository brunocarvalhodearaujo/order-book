const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const compression = require('compression')
const helmet = require('helmet')
const routes = require('./routes')
const { version } = require('../package.json')

const app = express()

// 3rd party middleware
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(helmet())

// custom config
app.disable('etag')
app.disable('x-powered-by')

// load routes
app.use(routes)

/* istanbul ignore next */
if (app.get('env') !== 'production') {
  app.set('json spaces', 2)
}

app.get('/', (request, response) => {
  response.send({ version })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((error, request, response, next) => {
  // set locals, only providing error in development
  response.locals.message = error.message
  response.locals.error = request.app.get('env') === 'development' ? error : {}

  // render the error page
  response.status(error.status || 500)
  response.json({ code: error.status, message: error.message })
})

module.exports = app
