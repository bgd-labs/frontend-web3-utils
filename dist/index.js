
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./frontend-web3-utils.cjs.production.min.js')
} else {
  module.exports = require('./frontend-web3-utils.cjs.development.js')
}
