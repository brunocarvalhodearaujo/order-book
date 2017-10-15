import fetch from 'node-fetch'
import { Cache } from './Cache'

const URL_BITVALOR = 'https://api.bitvalor.com/v1'

/**
 * @typedef {[ number, string, string ]} Offer formato: [ "EXCHANGE", preço, volume em BTC ]
 */

/**
 * disponibiliza o Índice BRXBT e dados consolidados das exchanges monitoradas.
 * O acesso é gratuito para incentivar o desenvolvimento de ideias e disseminação
 * do Bitcoin no Brasil. Aproveite o uso, mas evite excessos!
 * limite de chamadas: no máximo 1 requisição por minuto.
 */
export class BitValor {
  constructor () {
    this.cache = new Cache()
  }

  /**
   * recupera a lista de ofertas de todas as exchanges disponíveis em
   * [order_book | bitvalor](https://api.bitvalor.com/v1/order_book.json)
   *
   * @param {string} type tipo (bid: melhor (mais alta) oferta de compra | ask: melhor (mais baixa) oferta de venda)
   * @param {string} [exchange] identificador da troca
   * @param {number} [minValue] valor minimo
   * @param {number} [maxValue] valor maximo
   * @param {number} [minQuantity] quantidade minima
   * @param {number} [maxQuantity] quantidade maxima
   * @returns {Promise<{ [type: string]: Array<{ exchange: string, valor: number, btc_volume: number }> }>}
   */
  getOrderBook (type, exchange, minValue, maxValue, minQuantity, maxQuantity) {
    if (!type) {
      throw new Error('e necessario informar o tipo da requisição')
    }

    const key = `${URL_BITVALOR}/order_book.json`

    return this.cache.getItem(key)
      .then((cachedData) => {
        if (typeof cachedData === 'undefined') {
          return fetch(key)
            .then(response => response.json())
            .then(response => this.cache.setItem(key, response)
            .then(() => response))
        }

        return cachedData
      })
      .then(orders => {
        orders = orders[type]

        // aplica os filtros nos resultados
        if (exchange || minValue || maxValue || minQuantity || maxQuantity) {
          orders = orders.filter(order => {
            const predicate = [
              exchange && (order[0] === exchange),
              minValue && (order[1] >= minValue),
              maxValue && (order[1] <= maxValue),
              minQuantity && ((Math.round(order[2] * 100) >= Math.round(minQuantity * 100))),
              maxQuantity && ((Math.round(order[2] * 100) <= Math.round(maxQuantity * 100)))
            ]

            return !predicate.includes(false)
          })
        }

        return orders.map(([ exchange, price, btc ]) => ({ exchange, price, btc }))
      })
  }
}
