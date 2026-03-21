require("dotenv").config({ path: "./.env" });
const app = require('./src/app.js');
const connectdb = require('./src/config/db.js')


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

connectdb();

