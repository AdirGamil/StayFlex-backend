export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://adir:adir@stayflex.gzuhqtt.mongodb.net/?retryWrites=true&w=majority&appName=StayFlex',
  dbName : process.env.DB_NAME || 'stayDB'
}
