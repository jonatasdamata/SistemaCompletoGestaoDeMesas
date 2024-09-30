// src/routes/pedidos.js
import express from "express";
import { addPedido, getPedidos, addItemPedido, updatePedido } from "../controllers/pedidos.js";

const router = express.Router();

// Rota para obter pedidos
router.get("/", getPedidos); 

// Rota para adicionar pedido
router.post("/", addPedido); 

// Rota para adicionar item ao pedido
router.post("/addItem", addItemPedido); 

// Rota para atualizar pedido
router.put("/:id", updatePedido); 

export default router;
