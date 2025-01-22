const fs = require("fs");

function readDb() {
  try {
    const data = fs.readFileSync("db.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { heroes: [] };
  }
}

const addID = (req, res, next) => {
  const db = readDb();
  const lastId = db.heroes[db.heroes.length - 1]?.id || 0;
  req.body.id = lastId + 1;
  next();
};

module.exports = addID;
