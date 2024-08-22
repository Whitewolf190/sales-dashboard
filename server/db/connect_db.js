const { MongoClient } = require('mongodb');

const connectDB = async () => {
    try {
        const uri = "mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        const client = new MongoClient(uri);
        await client.connect();
        return client;
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
};

module.exports = connectDB;
