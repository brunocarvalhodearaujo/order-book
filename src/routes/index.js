const { Router } = require('express')
const Orders = require('./Orders')

module.exports = Router()
  .use('/orders', new Orders().didMount())
