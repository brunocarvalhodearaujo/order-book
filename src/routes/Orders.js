const express = require('express')
const BitValor = require('../adapters/BitValor')

module.exports = class Orders {
  constructor () {
    this.bitvalor = new BitValor()
  }

  /**
   * @api {GET} /orders recupera as informações de ofertas de todas as exchanges
   * @apiName GetOrders
   * @apiGroup Orders
   *
   * @apiParam {String} type tipo da requisição (bids|asks)
   * @apiParam {String} exchange cada exchange é um grupo, representado por seu código conforme legenda
   *                             [ARN, B2U, BAS, BIV, BSQ, FLW, FOX, LOC, MBT, NEG, PAX]
   * @apiParam {Number} min_value valor minimo
   * @apiParam {Number} max_value valor maximo
   * @apiParam {Number} min_quantity quantidade minima BTC
   * @apiParam {Number} max_quantity quantidade maxima BTC
   *
   * @param {express.Request} request
   * @param {express.Response} response
   * @param {express.NextFunction} next
   */
  async get (request, response, next) {
    try {
      const { type, exchange, min_value, max_value, min_quantity, max_quantity } = request.query

      if (!type) {
        return next({ message: 'o parametro `type` não foi definido', status: 400 })
      }

      if (type !== 'bids' && type !== 'asks') {
        return next({ message: 'o parametro `type` aceita somente os valores `bids` ou `asks`', status: 400 })
      }

      const orders = await this.bitvalor.getOrderBook(type, exchange, min_value, max_value, min_quantity, max_quantity)

      response.json({ [type]: orders })
    } catch (error) {
      next(error)
    }
  }

  didMount () {
    return express.Router()
      .get('/', this.get.bind(this))
  }
}
