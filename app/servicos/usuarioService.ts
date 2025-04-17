import { Usuario } from "../modelos/Usuario";
import { db } from "./bancoDeDadosService";

export const obterUsuario = (loginUsuario: string): Usuario | null => {
  const usuario = db.getFirstSync("SELECT * FROM usuarios WHERE login = ?", [
    loginUsuario,
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
  loginUsuario: string,
  senha: string,
  papel: number
): void => {
  const resultado = obterUsuario(loginUsuario);

  if (resultado != null) {
    throw new Error("Usuário já existe!");
  }

  db.runSync(`INSERT INTO usuarios (login, senha, papel) VALUES (?, ?, ?)`, [
    loginUsuario,
    senha,
    papel,
  ]);
};

export const entrarComUsuario = (
  loginUsuario: string,
  senha: string
): Usuario | null => {
  const usuario = obterUsuario(loginUsuario);

  if (usuario && usuario.login === loginUsuario && usuario.senha === senha) {
    return usuario;
  }

  return null;
};

export const trocarSenha = (
  loginUsuario: string,
  senhaAtual: string,
  novaSenha: string
): boolean => {
  try {
    const usuario = obterUsuario(loginUsuario);

    if (!usuario || usuario.senha !== senhaAtual) {
      throw new Error("Usuário ou senha atual incorretos!");
    }

    db.runSync("UPDATE usuarios SET senha = ? WHERE login = ?", [
      novaSenha,
      loginUsuario,
    ]);

    return true;
  } catch (error) {
    return false;
  }
};
