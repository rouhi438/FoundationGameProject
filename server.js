import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
const app = express();
app.use(cors());
app.use("/assets", express.static("assets"));
const port = 3000;
const db = new Database("./data/cards-data.sqlite");

app.get("/cards", (req, res) => {
  const rows = db.prepare("SELECT * FROM cards").all();
  res.json(rows);
});

app.get("/cards/random-pack", (req, res) => {
  const packNumber = Math.floor(Math.random() * 3) + 1;
  const rows = db.prepare("SELECT * FROM cards WHERE pack = ?").all(packNumber);
  res.json({ pack: packNumber, cards: rows });
});
app.listen(port, function () {
  console.log(`> Ready on http://localhost:${port}`);
});
