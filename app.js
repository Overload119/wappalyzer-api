const express = require('express')
const Wappalyzer = require('wappalyzer')
const morgan = require('morgan')

const PORT = process.env.PORT || 3000

const app = express()

if (process.env.DISABLE_REQUESTS_LOGGING == undefined) {
  app.use(morgan('combined'))
}

app.get('/', (req, res) => {
  res.send('Wappalyzer API is ready! 🚀')
})

const options = {
  batchSize: 5,
  debug: false,
  delay: 500,
  htmlMaxCols: 2000,
  htmlMaxRows: 3000,
  maxDepth: 3,
  maxUrls: 10,
  maxWait: 30000,
  recursive: false,
  probe: true,
  noScripts: false,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
}

app.get('/extract', async (req, res) => {
  let url = req.query.url

  if (url == undefined || url == '') {
    res.status(400).send('missing url query parameter')
    return
  }
  const wappalyzer = new Wappalyzer(options)

  try {
    await wappalyzer.init()

    // Optionally set additional request headers
    const headers = {}

    const site = await wappalyzer.open(url, headers)

    const results = await site.analyze()
    res.json(results)
  } catch (error) {
    res.status(500).send(`${error}\n`)
  } finally {
    await wappalyzer.destroy()
  }
})

app.listen(PORT, () =>
  console.log(`Starting Wappalyzer on http://0.0.0.0:${PORT}`),
)

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})
