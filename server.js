const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post("/save-user", function(req, res) {
    const filePath = path.join(__dirname, "data.json");

    let users = [];

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");

        if (fileData.trim() !== "") {
            users = JSON.parse(fileData);
        }
    }

    users.push(req.body);

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    console.log("Date salvate:", req.body);

    res.json({
        success: true,
        message: "Date salvate în data.json"
    });
});

app.listen(PORT, function() {
    console.log("Server pornit: http://localhost:" + PORT);
});