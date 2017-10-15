import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import helmet from 'helmet'
import router from 'express-slim-router'
import morgan from 'morgan'
import path from 'path'
import exception from '@paper/exception'
import compression from 'compression'
import { version } from '../package.json'

// Set the default environment to be `development`
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
// Set the default port to be `2650`
process.env.PORT = process.env.PORT || 3000

const server = express()

/**
 * Normalize a port into a number, string, or false.
 * @param {number} val
 * @returns {number|boolean}
 */
function normalizePort (val) {
  const port = parseInt(val, 10)

  /* istanbul ignore next */
  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/* istanbul ignore next */
if (server.get('env') !== 'production') {
  server.set('json spaces', 2)
  process.on('unhandledRejection', (reason, p) => {
    console.log('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason)
  })
}

const port = normalizePort(process.env.PORT)

server.disable('etag')
server.disable('x-powered-by')
server.set('port', port)

// 3rd party middleware
server.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(helmet())
server.use(compression())

// logger
server.use(morgan('dev'))

server.get('/', (request, response, next) => {
  response.send({ version })
})

// load api endpoints in routers
server.use('/', router(path.join(__dirname, 'controllers')))

// return 404 for non-existent URLs
server.use('*', (req, res, next) => next(404))

// treats all api errors
server.use(exception())

// listen and export server for unit tests
export default server.listen(port, () => {
  console.log(`servidor iniciando na porta: ${server.get('port')}`)
})
