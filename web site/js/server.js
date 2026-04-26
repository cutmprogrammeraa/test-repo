const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/save-user", (req, res) => {
  const newUser = req.body;

  fs.readFile("data.json", "utf8", (err, data) => {
    let users = [];

    if (!err && data) {
      users = JSON.parse(data);
    }

    users.push(newUser);

    fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Eroare la salvare" });
      }

      res.json({ message: "Date salvate în data.json" });
    });
  });
});

app.listen(3000, () => {
  console.log("Server pornit pe http://localhost:3000");
});