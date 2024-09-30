// src/index.js
import express from "express";
import userRoutes from "./routes/users.js";
import pedidoRoutes from "./routes/pedidos.js";
import mesaRoutes from "./routes/mesas.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// Define as rotas
app.use("/users", userRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/mesas", mesaRoutes);

app.listen(8800, () => {
  console.log("API is running on port 8800");
});
