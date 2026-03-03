require("dotenv").config({ path: "./.env" });
const app = require('./src/app.js');
const connectdb = require('./src/config/db.js')


app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

connectdb();

