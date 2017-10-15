import NodeCache from 'node-cache'

/**
 * A simple caching module that has set, get and delete methods and works a little bit like memcached.
 */
export class Cache {
  /**
   * a simple singleton to store a global variable
   * @returns {NodeCache}
   */
  get cache () {
    if (!global.hasOwnProperty('nodeCache')) {
      global.nodeCache = new NodeCache({ stdTTL: 100, checkperiod: 120 })
    }
    return global.nodeCache
  }

  /**
   * Sets a key value pair
   *
   * @param {string} key
   * @param {any} value
   * @returns {Promise<boolean>}
   */
  setItem (key, value) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.cache.set(key, value)
        resolve(data)
      } catch (error) {
        /* istanbul ignore next */
        reject(error)
      }
    })
  }

  /**
   * Gets a saved value from the cache. Returns a undefined if not found or expired.
   * If the value was found it returns an object with the key value pair.
   *
   * @param {string} key
   * @returns {Promise<undefined|any>}
   */
  getItem (key) {
    return new Promise((resolve, reject) => {
      try {
        const data = this.cache.get(key)
        resolve(data)
      } catch (error) {
        /* istanbul ignore next */
        reject(error)
      }
    })
  }
}
