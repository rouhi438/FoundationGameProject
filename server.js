import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
const app = express();
app.use(cors());
app.use("/assets", express.static("assets"));
const port = process.env.PORT || 3000;

let db;
try {
  db = new Database("./data/cards-data.sqlite");
} catch (err) {
  console.error("Failed to open DB:", err);
  process.exit(1);
}

app.get("/cards", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM cards").all();
    res.json(rows);
  } catch (err) {
    console.error("DB error on /cards:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/cards/random-pack", (req, res) => {
  try {
    const packNumber = Math.floor(Math.random() * 3) + 1;
    const rows = db
      .prepare("SELECT * FROM cards WHERE pack = ?")
      .all(packNumber);
    res.json({ pack: packNumber, cards: rows });
  } catch (err) {
    console.error("DB error on /cards/random-pack:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, function () {
  console.log(`> Ready on http://localhost:${port}`);
});

process.on("SIGINT", () => {
  try {
    if (db) db.close();
  } catch (e) {
    // ignore
  }
  process.exit();
});
