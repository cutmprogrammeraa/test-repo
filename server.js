const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const filePath = path.join(__dirname, "data.json");

app.post("/save-user", function(req, res) {
    const user = req.body;

    let data = { users: [] };

    if (fs.existsSync(filePath)) {
        const file = fs.readFileSync(filePath, "utf8");
        if (file.trim() !== "") {
            data = JSON.parse(file);
        }
    }

    data.users.push(user);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({ status: "ok", message: "User salvat în data.json" });
});

app.listen(3000, function() {
    console.log("Server pornit: http://localhost:3000");
});