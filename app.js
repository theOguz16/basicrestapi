const { ObjectId } = require("mongodb");
const express = require("express");
const { connectToDb, getDb } = require("./db.js");
const app = express();

app.use(express.json());

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("3000 portu dinleniliyor");
    });
    db = getDb();
  }
});

app.get("/", (req, res) => {
  let kitaplar = [];

  const sayfa = req.query.s || 0;
  const sayfaVeriAdet = 1;

  db.collection("kitaplar")
    .find()
    .skip(sayfaVeriAdet * sayfa)
    .limit(sayfaVeriAdet)
    .forEach((kitap) => kitaplar.push(kitap))
    .then(() => {
      res.status(200).json(kitaplar);
    })
    .catch(() => {
      res.status(500).json({ hata: "verilere erişilemedi" });
    });
});
app.post("/", (req, res) => {
  const kitap = req.body;

  db.collection("kitaplar")
    .insertOne(kitap)
    .then((sonuc) => {
      res.status(201).json(sonuc);
    })
    .catch((err) => {
      res.status(500).json({ hata: "veri eklenemedi" });
      console.log(err);
    });
});
app.delete("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const objId = new ObjectId(req.params.id);

    db.collection("kitaplar")
      .deleteOne({ _id: objId })
      .then((sonuc) => {
        res.status(200).json(sonuc);
      })
      .catch((err) => {
        res.status(500).json({ hata: "veri silinemedi" });
      });
  } else {
    res.status(500).json({ hata: "geçersiz id" });
  }
});
app.get("/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    const objId = new ObjectId(req.params.id);

    db.collection("kitaplar")
      .findOne({ _id: objId })
      .then((sonuc) => {
        res.status(200).json(sonuc);
      })
      .catch((err) => {
        res.status(500).json({ hata: "veriye erişilemedi" });
      });
  } else {
    res.status(500).json({ hata: "geçersiz id" });
  }
});
app.patch("/:id", (req, res) => {
  const guncellenecekVeri = req.body;

  if (ObjectId.isValid(req.params.id)) {
    const objId = new ObjectId(req.params.id);

    db.collection("kitaplar")
      .updateOne({ _id: objId }, { $set: guncellenecekVeri })
      .then((sonuc) => {
        res.status(200).json(sonuc);
      })
      .catch((err) => {
        res.status(500).json({ hata: "veri güncellenemedi" });
      });
  } else {
    res.status(500).json({ hata: "geçersiz id" });
  }
});
