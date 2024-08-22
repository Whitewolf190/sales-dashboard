const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connect_db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.get('/',(req,res)=>{
    res.send('sales-dashboard api')
})
app.use('/api/charts', require('./routes/charts'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
