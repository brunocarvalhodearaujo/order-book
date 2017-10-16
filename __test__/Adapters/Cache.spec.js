/* eslint-env jest */
const Cache = require('../../src/adapters/Cache')

/**
 * @type {Cache}
 */
let cache

beforeAll(() => {
  cache = new Cache()
})

// avalia se o conteudo vindo do bitvalor esta no formato correto
describe('Cache', () => {
  it('should return correct data in get()', async () => {
    const status = await cache.setItem('xxx', 'xxx')
    expect(status).toEqual(true)

    const value = await cache.getItem('xxx')
    expect(value).toEqual('xxx')

    const notExistentData = await cache.getItem('notexistentdata')
    expect(notExistentData).toBeUndefined()
  })
})
