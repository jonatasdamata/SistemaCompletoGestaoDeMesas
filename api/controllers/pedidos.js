import { db } from "../db.js";

// Função para obter pedidos
export const getPedidos = (_, res) => {
  const q = `
    SELECT pedidos.id AS pedidoId, mesas.nome AS mesa, garcom, GROUP_CONCAT(itens_pedido.item) AS itens 
    FROM pedidos
    JOIN mesas ON pedidos.mesa_id = mesas.id
    LEFT JOIN itens_pedido ON pedidos.id = itens_pedido.pedido_id
    GROUP BY pedidos.id
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar pedidos:", err);
      return res.status(500).json({ error: "Erro ao buscar pedidos." });
    }
    
    // Processar os pedidos para garantir que 'itens' seja um array
    const pedidosProcessados = data.map(pedido => ({
      ...pedido,
      itens: pedido.itens ? pedido.itens.split(',') : [] // Transforma a string em array
    }));

    return res.status(200).json(pedidosProcessados);
  });
};


// Função para adicionar um pedido com itens
export const addPedido = (req, res) => {
  const { mesa_id, garcom, itens } = req.body;

  // Insere o novo pedido
  const q = "INSERT INTO pedidos(`mesa_id`, `garcom`) VALUES(?, ?)";
  const values = [mesa_id, garcom];

  db.query(q, values, (err, result) => {
    if (err) {
      console.error("Erro ao salvar pedido:", err);
      return res.status(500).json({ error: "Erro ao salvar pedido." });
    }

    const pedidoId = result.insertId;
    console.log("Pedido salvo com ID:", pedidoId);

    if (itens && itens.length > 0) {
      const itemQueries = itens.map(item => {
        const itemQuery = "INSERT INTO itens_pedido(`pedido_id`, `item`) VALUES(?, ?)";
        return new Promise((resolve, reject) => {
          db.query(itemQuery, [pedidoId, item], (err) => {
            if (err) {
              console.error("Erro ao adicionar item ao pedido:", err);
              return reject(err);
            }
            resolve();
          });
        });
      });

      // Executa todas as inserções de itens
      Promise.all(itemQueries)
        .then(() => {
          return res.status(201).json({ message: "Pedido criado com sucesso.", pedidoId });
        })
        .catch(err => {
          console.error("Erro ao adicionar itens ao pedido:", err);
          return res.status(500).json({ error: "Erro ao adicionar itens ao pedido." });
        });
    } else {
      return res.status(201).json({ message: "Pedido criado com sucesso.", pedidoId });
    }
  });
};

// Função para adicionar um item ao pedido
export const addItemPedido = (req, res) => {
  const { pedido_id, itens, quantidade } = req.body;

  const q = "INSERT INTO itens_pedido(`pedido_id`, `item`, `quantidade`) VALUES(?, ?, ?)";
  const values = [pedido_id, itens, quantidade];

  db.query(q, values, (err) => {
    if (err) {
      console.error("Erro ao adicionar item ao pedido:", err);
      return res.status(500).json(err);
    }
    return res.status(201).json("Item adicionado ao pedido.");
  });
};

// Função para atualizar um pedido
export const updatePedido = (req, res) => {
  const id = req.params.id;
  const { mesa_id, garcom, itens } = req.body;

  const query = `
      UPDATE pedidos 
      SET mesa_id = ?, garcom = ?, itens = ? 
      WHERE id = ?
  `;

  db.query(query, [mesa_id, garcom, itens, id], (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).send({ message: 'Erro ao atualizar pedido' });
      } else {
          res.send({ message: 'Pedido atualizado com sucesso' });
      }
  });
};


// Função para excluir um pedido
export const deletePedido = (req, res) => {
  const pedidoId = req.params.id;

  const deleteItemsQuery = "DELETE FROM itens_pedido WHERE pedido_id = ?";
  const deletePedidoQuery = "DELETE FROM pedidos WHERE id = ?";

  db.query(deleteItemsQuery, [pedidoId], (err) => {
    if (err) {
      console.error("Erro ao excluir itens do pedido:", err);
      return res.status(500).json(err);
    }

    db.query(deletePedidoQuery, [pedidoId], (err) => {
      if (err) {
        console.error("Erro ao excluir pedido:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Pedido excluído com sucesso.");
    });
  });
};
