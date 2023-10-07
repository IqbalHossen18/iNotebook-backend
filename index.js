const connectToMonto = require("./db");
const express = require("express");
connectToMonto();

const app = express();
const port = 5000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//available routes

app.use("/api/auth", require("./routes/auth"));
// app.use('/api/notes', require('./routes/notes'))

// don't do like that{
// app.get('/login', (req, res) => {
//   res.send('Hello login')
// })
// app.get('/signup', (req, res) => {
//   res.send('Hello signup')
// })
// }
// const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
