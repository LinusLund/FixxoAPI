const mongoose = require('mongoose')

const mongodb  = async () => {

  const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoBD körs på ${conn.connection.host}`)

}

module.exports = mongodb