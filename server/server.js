import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'

// Connection URL
mongoose.Promise = global.Promise
console.info('Connecting to mongoose %s.', config.mongoUri)
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

mongoose.connection.on('open', function() {
  console.log(`--Database name: ${mongoose.connection.db.databaseName} Connected Successfully`)
  mongoose.connection.db.dropDatabase(function(err, result){
    console.log(`! ${mongoose.connection.db.databaseName} database dropped.`)
  });
});

mongoose.connection.on('error', () => {
  console.error('--ERROR Connecting to mongoose')
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})
