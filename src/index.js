const express = require('express');
const path = require("path");
const app = express();
const port = 3003;

// raiz do projeto (um nível acima de /src)
const ROOT = path.resolve(__dirname, "..");

// estáticos
app.use(express.static(path.join(ROOT, "public")));
app.use("/public", express.static(path.join(ROOT, "public")));

// rotas
app.get(["/", "/index"], (req, res) => {
  res.sendFile(path.join(ROOT, "public/index.html"));
});
// rota para thanks.html
app.get("/thanks", (req, res) => {
  res.sendFile(path.join(ROOT, "public/thanks.html"));
});
//rota para 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(ROOT, "public/404.html"));
});

app.listen(port, () => {
  console.log(`Rodando na porta: http://localhost:${port}`);
});