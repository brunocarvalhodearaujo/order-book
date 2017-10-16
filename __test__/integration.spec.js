/* eslint-env jest */
const supertest = require('supertest')
const server = require('../src')

afterAll(() => {
  server.close()
})

describe('GET /404', () => {
  it('should return 404 for non-existent URLs', async () => {
    await supertest(server)
      .get('/404')
      .expect(404)
  })
})

describe('GET /orders', () => {
  it('should return error for not found `type` query parameters in URL', async () => {
    await supertest(server)
      .get('/orders')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('o parametro `type` não foi definido')
        expect(response.body.code).toBe(400)
      })
  })

  it('should return error for wrong `type` query parameters in URL', async () => {
    await supertest(server)
      .get('/orders')
      .expect('Content-Type', /json/)
      .query({ type: 'anywrongtext' })
      .expect(400)
      .then(response => {
        expect(response.body.message).toBe('o parametro `type` aceita somente os valores `bids` ou `asks`')
        expect(response.body.code).toBe(400)
      })
  })

  it('should return orders with custom filters using query parameters in URL', async () => {
    const filters = {
      type: 'bids',
      exchange: 'LOC',
      min_value: 10000.00,
      max_value: 15000.00,
      min_quantity: 0.06787723,
      max_quantity: 0.25867352
    }

    await supertest(server)
      .get('/orders')
      .expect('Content-Type', /json/)
      .query(filters)
      .expect(200)
      .then(response => {
        expect(response.body).toHaveProperty('bids')
        expect(response.body.bids).toBeInstanceOf(Array)

        for (const bidsItem of response.body.bids) {
          console.log(bidsItem)
          expect(bidsItem).toBeInstanceOf(Object)
          expect(Object.keys(bidsItem).length).toEqual(3)
          expect(typeof bidsItem.exchange).toBe('string')
          expect(bidsItem.exchange).toEqual('LOC')
          expect(typeof bidsItem.price).toBe('number')
          expect(typeof bidsItem.btc).toBe('number')
          expect(Math.round(bidsItem.btc * 100)).toBeLessThanOrEqual(Math.round(filters.max_quantity * 100))
          expect(Math.round(bidsItem.btc * 100)).toBeGreaterThanOrEqual(Math.round(filters.min_quantity * 100))
        }
      })
  })
})
