
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./bgd-fe-utils.cjs.production.min.js')
} else {
  module.exports = require('./bgd-fe-utils.cjs.development.js')
}
