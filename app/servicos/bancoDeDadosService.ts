import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("bancodedados.db");

export async function iniciarBancoDeDados() {
  try {
    db.withTransactionSync(() => {
      db.execSync(`
        DROP TABLE IF EXISTS usuario;
        DROP TABLE IF EXISTS agendamento;
        DROP TABLE IF EXISTS servico;
        DROP TABLE IF EXISTS ganho;

        CREATE TABLE IF NOT EXISTS usuario (
          id INTEGER PRIMARY KEY NOT NULL,
          nome TEXT NOT NULL,
          login TEXT NOT NULL UNIQUE,
          senha TEXT NOT NULL,
          papel INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS servico (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria TEXT NOT NULL,
          preco REAL NOT NULL,
          descricao TEXT NOT NULL,
          duracao INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agendamento (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          servico_id INTEGER NOT NULL,
          data_inicio_agendamento TEXT NOT NULL,
          data_fim_agendamento TEXT NOT NULL,
          data_cancelamento TEXT,
          data_conclusao TEXT,
          FOREIGN KEY (servico_id) REFERENCES servico(id),
          FOREIGN KEY (usuario_id) REFERENCES usuario(id)
        );

        CREATE TABLE IF NOT EXISTS ganho (
          data TEXT PRIMARY KEY,
          valor REAL NOT NULL
        );

        INSERT INTO usuario (nome, login, senha, papel) VALUES 
          ('Administrador', 'a', 'a', 1),
          ('Cliente1', 'c', 'c', 2),
          ('João Silva', 'joao', 'senha123', 2),
          ('Maria Oliveira', 'maria', 'senha456', 2),
          ('Carlos Souza', 'carlos', 'senha789', 2),
          ('Ana Costa', 'ana', 'senha321', 2);

        INSERT INTO servico (categoria, preco, descricao, duracao) VALUES
          ('Embelezamento Facial', 30.00, 'Design de sobrancelhas', 30),
          ('Embelezamento Facial', 40.00, 'Design com Henna', 45),
          ('Depilação a Cera', 15.00, 'Buço Feminino', 20),
          ('Depilação a Cera', 30.00, 'Rosto Feminino', 30),
          ('Depilação a Cera', 60.00, 'Barba Masculina', 40),
          ('Depilação a Cera', 25.00, 'Axilas', 25),
          ('Depilação a Cera', 35.00, '1/2 Perna', 30),
          ('Depilação a Cera', 55.00, 'Perna Inteira', 50),
          ('Depilação a Cera', 45.00, 'Virilha Cavada Feminina', 35),
          ('Depilação a Cera', 65.00, 'Virilha Total', 40),
          ('Estética Facial', 120.00, 'Limpeza de Pele + Peeling de Diamante', 60),
          ('Estética Facial', 150.00, 'Peeling de Vitamina C', 75),
          ('Estética Facial', 80.00, 'Revitalização + Drenagem Linfática Facial', 60),
          ('Estética Corporal', 90.00, 'Detox Corporal', 60),
          ('Estética Corporal', 100.00, 'Drenagem Linfática (área)', 45),
          ('Estética Corporal', 130.00, 'Drenagem Linfática (corpo todo)', 90),
          ('Estética Corporal', 95.00, 'Liberação Miofascial + Ventosaterapia (área)', 60);

        INSERT INTO agendamento (usuario_id, servico_id, data_inicio_agendamento, data_fim_agendamento) VALUES
          (3, 6, '2025-04-18T10:30:00', '2025-04-18T11:00:00'),
          (4, 11, '2025-04-18T14:00:00', '2025-04-18T15:00:00'),
          (5, 13, '2025-04-19T12:00:00', '2025-04-19T13:00:00'),
          (2, 16, '2025-04-20T08:00:00', '2025-04-20T09:30:00'),
          (3, 7, '2025-04-21T15:00:00', '2025-04-21T15:30:00'),
          (4, 8, '2025-04-22T13:30:00', '2025-04-22T14:20:00'),
          (5, 9, '2025-04-23T10:00:00', '2025-04-23T11:00:00'),
          (2, 1, '2025-04-17T10:00:00', '2025-04-17T10:30:00'),
          (2, 2, '2025-04-17T11:00:00', '2025-04-17T11:30:00'),
          (2, 3, '2025-04-17T12:00:00', '2025-04-17T12:15:00'),
          (2, 4, '2025-04-17T12:30:00', '2025-04-17T13:00:00'),
          (2, 5, '2025-04-17T13:30:00', '2025-04-17T14:10:00'),
          (2, 6, '2025-04-17T14:30:00', '2025-04-17T14:50:00'),
          (2, 7, '2025-04-17T15:00:00', '2025-04-17T15:25:00'),
          (2, 8, '2025-04-17T15:30:00', '2025-04-17T16:10:00'),
          (2, 9, '2025-04-17T16:30:00', '2025-04-17T17:00:00'),
          (2, 10, '2025-04-17T17:15:00', '2025-04-17T17:55:00'),
          (2, 11, '2025-04-17T18:00:00', '2025-04-17T19:00:00'),
          (2, 12, '2025-04-17T19:30:00', '2025-04-17T20:30:00'),
          (2, 13, '2025-04-17T21:00:00', '2025-04-17T22:00:00'),
          (2, 14, '2025-04-17T22:30:00', '2025-04-17T23:30:00'),
          (2, 15, '2025-04-18T10:00:00', '2025-04-18T11:00:00'),
          (2, 16, '2025-04-18T11:30:00', '2025-04-18T12:30:00');

        INSERT INTO ganho (data, valor) VALUES 
          ('2025-03-14', 120),
          ('2025-03-15', 200),
          ('2025-03-16', 150),
          ('2025-03-17', 180),
          ('2025-03-18', 220),
          ('2025-03-19', 130),
          ('2025-03-20', 170),
          ('2025-03-21', 90),
          ('2025-03-22', 300),
          ('2025-03-23', 250),
          ('2025-03-24', 310),
          ('2025-03-25', 80),
          ('2025-03-26', 400),
          ('2025-03-27', 275),
          ('2025-03-28', 120),
          ('2025-03-29', 330),
          ('2025-03-30', 500),
          ('2025-03-31', 290),
          ('2025-04-01', 210),
          ('2025-04-02', 180),
          ('2025-04-03', 460),
          ('2025-04-04', 150),
          ('2025-04-05', 100),
          ('2025-04-06', 390),
          ('2025-04-07', 240),
          ('2025-04-08', 310),
          ('2025-04-09', 420),
          ('2025-04-10', 79),
          ('2025-04-11', 510),
          ('2025-04-12', 320),
          ('2025-04-13', 275),
          ('2025-04-14', 345),
          ('2025-04-15', 564),
          ('2025-04-16', 5768),
          (strftime('%Y-%m-%d', 'now'), 340);

      `);
    });
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
}
