import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("bancodedados.db");

export async function iniciarBancoDeDados() {
  try {
    db.withTransactionSync(() => {
      db.execSync(`
        DROP TABLE IF EXISTS usuarios;
        DROP TABLE IF EXISTS agendamentos;
        DROP TABLE IF EXISTS servicos;

        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY NOT NULL,
          nome TEXT NOT NULL,
          login TEXT NOT NULL UNIQUE,
          senha TEXT NOT NULL,
          papel INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS servicos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria TEXT NOT NULL,
          preco REAL NOT NULL,
          descricao TEXT NOT NULL,
          duracao INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS agendamentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          servico_id INTEGER NOT NULL,
          data_inicio_agendamento TEXT NOT NULL,
          data_fim_agendamento TEXT NOT NULL,
          FOREIGN KEY (servico_id) REFERENCES servicos(id),
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );

        INSERT INTO usuarios (nome, login, senha, papel) VALUES 
        ('admin1', 'a', 'a', 1), 
        ('cliente2', 'c', 'c', 2);

        INSERT INTO servicos (categoria, preco, descricao, duracao) VALUES
        ('Embelezamento Facial', 25, 'Design de sobrancelhas', 30),
        ('Embelezamento Facial', 35, 'Design com Henna', 30),
        ('Depilação a Cera', 12, 'Buço Feminino', 15),
        ('Depilação a Cera', 35, 'Rosto Feminino', 30),
        ('Depilação a Cera', 60, 'Barba Masculina', 40),
        ('Depilação a Cera', 20, 'Axilas', 20),
        ('Depilação a Cera', 30, '1/2 Perna', 25),
        ('Depilação a Cera', 55, 'Perna Inteira', 40),
        ('Depilação a Cera', 45, 'Virilha Cavada Feminina', 30),
        ('Depilação a Cera', 60, 'Virilha Total', 40),
        ('Estética Facial', 100, 'Limpeza de Pele + Peeling de Diamante', 60),
        ('Estética Facial', 100, 'Peeling de Vitamina C', 60),
        ('Estética Facial', 50, 'Revitalização + Drenagem Linfática Facial', 60),
        ('Estética Corporal', 70, 'Detox Corporal', 60),
        ('Estética Corporal', 65, 'Drenagem Linfática (área)', 45),
        ('Estética Corporal', 120, 'Drenagem Linfática (corpo todo)', 90),
        ('Estética Corporal', 70, 'Liberação Miofascial + Ventosaterapia (área)', 60);

        INSERT INTO agendamentos (usuario_id, servico_id, data_inicio_agendamento, data_fim_agendamento) VALUES
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00'),
        (2, 5, '2025-04-15T10:00:00', '2025-04-15T11:00:00');
      `);
    });
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
}
