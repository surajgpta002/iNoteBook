const connectTOMongo = require('./db');
const express = require('express')
const cors = require ('cors')

connectTOMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json());  ///for using the req.body we have to use the middleware 

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`inotebook backend listening at http://localhost:${port}`)
})

