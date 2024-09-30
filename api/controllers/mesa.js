import { db } from "../db.js";

export const getMesas = (_, res) => {
  const q = "SELECT * FROM mesas";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addMesa = (req, res) => {
  const q = "INSERT INTO mesas(`nome`) VALUES(?)";
  const values = [req.body.nome];

  db.query(q, values, (err) => {
    if (err) return res.status(500).json(err);

    return res.status(201).json("Mesa adicionada com sucesso.");
  });
};
