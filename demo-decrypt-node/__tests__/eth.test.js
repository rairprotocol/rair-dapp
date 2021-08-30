require('dotenv').config()

const test = require('ava')

const { accountHasToken } = require('../bin/integrations/eth')

test('Can call a contract', async t => {
  const result = await accountHasToken('0xc0017405E287476443Ab1B342B86f2ea92Ef9F73', '0xd07dc4262bcdbf85190c01c996b4c06a461d2430', '50984')
  t.is(result, true)
})
