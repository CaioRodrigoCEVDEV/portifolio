const express = require('express')
const path = require("path");
const app = express()
const port = 3003

// raiz do projeto (um nível acima de /src)
const ROOT = path.resolve(__dirname, "..");

// estáticos
app.use(express.static(path.join(ROOT, "public")));
app.use("/public", express.static(path.join(ROOT, "public")));

// rotas
app.get(["/", "/index"], (req, res) => {
  res.sendFile(path.join(ROOT, "public/index.html"));
});

app.listen(port, () => {
  console.log(`Rodando na porta: ${port}`)
});