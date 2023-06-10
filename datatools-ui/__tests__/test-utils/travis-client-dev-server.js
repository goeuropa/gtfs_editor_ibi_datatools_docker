// Travis was getting some errors from budo because it was watching lots of
// files.  This server is just to serve up the built files and proxy some
// requests to datatools-server.  It also helps because the build script can
// be ran and tracked independently of this server.

const path = require('path')

const express = require('express')
const proxy = require('express-http-proxy')
const app = express()

app.use('/dist', express.static('dist'))
app.use(
  '/api',
  proxy(
    'http://localhost:4000/api/',
    {
      proxyReqPathResolver: req => {
        // need to rewrite the url to include the api part
        return `/api${req.url}`
      }
    }
  )
)
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../index.html'))
})

const port = 9966
app.listen(port, () => {
  console.log('server listening on port ' + port)
})
