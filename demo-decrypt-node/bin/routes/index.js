var express = require('express')

module.exports = context => {
  const router = express.Router()
  router.use('/auth', require('./auth')(context))
  router.use('/docs', require('./swagger'))
  router.use('/media', require('./media')(context))
  router.use('/users', require('./users')(context))
  return router
}
