const express = require('express');
const Wappalyzer = require('wappalyzer');
const morgan = require('morgan');
const cluster = require('cluster');

const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  const cpuCount = require('os').cpus().length;
  console.log('Spinning up %d workers', cpuCount);
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
  cluster.on('exit', function (worker) {
    console.log('Worker %d died :(', worker.id);
    cluster.fork();
  });
} else {
  const app = express();

  if (process.env.DISABLE_REQUESTS_LOGGING == undefined) {
    app.use(morgan('combined'));
  }

  app.get('/', (req, res) => {
    res.send('Wappalyzer API is ready! 🚀');
  });
  const options = {
    batchSize: 3,
    debug: false,
    delay: 500,
    htmlMaxCols: 10000,
    htmlMaxRows: 10000,
    maxDepth: 2,
    maxUrls: 10,
    maxWait: 30000,
    recursive: false,
    probe: true,
    noScripts: false,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
  };

  app.get('/extract', async (req, res) => {
    let url = req.query.url;
    const isRecursive = Boolean(req.query.recursive);

    if (url == undefined || url == '') {
      res.status(400).send('missing url query parameter');
      return;
    }

    Object.assign(options, {
      recursive: isRecursive,
    });
    const wappalyzer = new Wappalyzer(options);

    try {
      await wappalyzer.init();

      // Optionally set additional request headers
      const headers = {};

      const site = await wappalyzer.open(url, headers);

      const results = await site.analyze();
      res.json(results);
    } catch (error) {
      res.status(500).send(`${error}\n`);
    } finally {
      await wappalyzer.destroy();
      // Make sure the process is dead.
      try {
        if (wappalyzer.browser._process.pid) {
          process.kill(wappalyzer.browser._process.pid, 'SIGTERM');
        }
      } catch (error) {
        console.log(
          `Sent SIGTERM to ${wappalyzer.browser._process.pid} but received ${error.message}`,
        );
      }
    }
  });

  app.listen(PORT, () =>
    console.log(
      `Starting Wappalyzer on http://0.0.0.0:${PORT} - ${cluster.worker.id}`,
    ),
  );

  process.on('uncaughtException', function (err) {
    console.error(
      new Date().toUTCString() + ' uncaughtException:',
      err.message,
    );
    console.error(err.stack);
    process.exit(1);
  });
}
