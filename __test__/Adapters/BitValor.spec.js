/* eslint-env jest */
import { BitValor } from '../../src/adapters/BitValor'

/**
 * @type {BitValor}
 */
let bitvalor

beforeAll(() => {
  bitvalor = new BitValor()
})

// avalia se o conteudo vindo do bitvalor esta no formato correto
describe('BitValor', () => {
  it('should incorrect call getOrderBook()', () => {
    expect(bitvalor.getOrderBook).toThrowError('e necessario informar o tipo da requisição')
  })

  it('should return correct data in getOrderBook()', () => {
    bitvalor.getOrderBook('bids', 'LOC', 10000.00, 15000.00)
      // testa a lista
      .then(orderBook => {
        expect(orderBook).toBeInstanceOf(Array)

        for (const bidsItem of orderBook) {
          expect(bidsItem).toBeInstanceOf(Object)
          expect(Object.keys(bidsItem).length).toEqual(3)
          expect(typeof bidsItem.exchange).toBe('string')
          expect(typeof bidsItem.preco).toBe('number')
          expect(typeof bidsItem.volume).toBe('number')
        }
      })
  })
})
