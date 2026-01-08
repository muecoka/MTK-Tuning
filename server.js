import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.post("/api/quote", (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: "items must be an array" });
  }

  const totalGross = items.reduce((sum, item) => {
    const price = Number(item.totalGross || 0);
    return sum + (Number.isFinite(price) ? price : 0);
  }, 0);

  const net = totalGross / 1.2;
  const vat = totalGross - net;

  res.json({
    totalGross: Number(totalGross.toFixed(2)),
    net: Number(net.toFixed(2)),
    vat: Number(vat.toFixed(2)),
    vatRate: 0.2,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
