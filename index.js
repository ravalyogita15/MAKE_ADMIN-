const express = require("express");
const fs = require("fs");
const addID = require("./middlewares/addID");
const auth = require("./middlewares/auth");
const logger = require("./middlewares/logger");

const app = express();
app.use(express.json());

function readDb() {
  try {
    const data = fs.readFileSync("db.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { heroes: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync("db.json", JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
}

app.post("/add/hero", addID, (req, res) => {
  try {
    const db = readDb();
    db.heroes.push(req.body);
    writeDb(db);
    res.status(200).json(db.heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/heroes", (req, res) => {
  try {
    const db = readDb();
    res.status(200).json(db.heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/update/villain/:hero_id", auth, (req, res) => {
  try {
    const { hero_id } = req.params;
    const villain = req.body;
    const db = readDb();
    const hero = db.heroes.find((h) => h.id === parseInt(hero_id));

    if (!hero) {
      return res.status(404).json({ message: "Hero not found" });
    }

    hero.villains.push(villain);
    writeDb(db);
    res.status(200).json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/delete/hero/:hero_id", auth, (req, res) => {
  try {
    const { hero_id } = req.params;
    const db = readDb();
    const heroIndex = db.heroes.findIndex((h) => h.id === parseInt(hero_id));

    if (heroIndex === -1) {
      return res.status(404).json({ message: "Hero not found" });
    }

    db.heroes.splice(heroIndex, 1);
    writeDb(db);
    res.status(200).json(db.heroes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(logger);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
