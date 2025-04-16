import { db } from "../App";
import { Usuario } from "../modelos/Usuario";

export const obterUsuario = (nomeUsuario: string): Usuario | null => {
  const usuario = db.getFirstSync("SELECT * FROM usuarios WHERE nome = ?", [
    nomeUsuario,
  ]);
  return usuario as Usuario;
};

export const obterUsuarioPorId = (usuarioId: number): Usuario | null => {
  const usuario = db.getFirstSync("SELECT * FROM usuarios WHERE id = ?", [
    usuarioId,
  ]);
  return usuario as Usuario;
};

export const adicionarUsuario = (
  nomeUsuario: string,
  senha: string,
  papel: number
): void => {
  const resultado = obterUsuario(nomeUsuario);

  if (resultado != null) {
    throw new Error("Usuário já existe!");
  }

  db.runSync(
    `INSERT INTO usuarios (nome, senha, papel) VALUES (?, ?, ?)`,
    [nomeUsuario, senha, papel]
  );
};

export const entrarComUsuario = (
  nomeUsuario: string,
  senha: string
): Usuario | null => {
  const usuario = obterUsuario(nomeUsuario);

  if (usuario && usuario.nome === nomeUsuario && usuario.senha === senha) {
    return usuario;
  }

  return null;
};

export const trocarSenha = (
  nomeUsuario: string,
  senhaAtual: string,
  novaSenha: string
): boolean => {
  try {
    const usuario = obterUsuario(nomeUsuario);

    if (!usuario || usuario.senha !== senhaAtual) {
      throw new Error("Usuário ou senha atual incorretos!");
    }

    db.runSync("UPDATE usuarios SET senha = ? WHERE nome = ?", [
      novaSenha,
      nomeUsuario,
    ]);

    return true;
  } catch (error) {
    return false;
  }
};
