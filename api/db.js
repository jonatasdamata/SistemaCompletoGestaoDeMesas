import mysql from "mysql";

// Configuração do banco de dados
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "banco",
    database: "cantinhododende",
});

// Teste a conexão
db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
});
