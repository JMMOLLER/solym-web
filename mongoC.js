require('dotenv').config({ path: './.env' });
const { MongoClient } = require('mongodb');

let db;

MongoClient.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true
}, (err, client) => {
    if(err){
        console.log(err);
        process.exit(0);
    }
    db = client.db('SymlyWeb');
    console.log('Conexión establecida con la Base de Datos')
});

const getConnection = () => db;

module.exports = { getConnection };