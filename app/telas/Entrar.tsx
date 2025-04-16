import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import { entrarComUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";

export default function Login({ navigation }: any) {
  const [nome, definirNomeUsuario] = useState("");
  const [senha, setPassword] = useState("");
  const { definirUsuario } = useUsuario();

  const handleLogin = () => {
    if (!nome || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const usuario = entrarComUsuario(nome, senha);

    if (usuario) {
      definirUsuario({
        id: usuario.id,
        nome: usuario.nome,
        papel: usuario.papel,
        senha: usuario.senha,
      });
      if (usuario.papel === PapelUsuario.ADMINISTRADOR) {
        navigation.replace(NOMES.INICIO_ADMIN);
      } else {
        navigation.replace(NOMES.INICIO);
      }
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={definirNomeUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Recuperação de senha", "Função ainda não implementada!")
        }
      >
        <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.REGISTRAR)}>
          <Text style={styles.footerLink}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 15,
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    flexDirection: "row",
  },
  footerText: {
    color: "#333",
    fontSize: 16,
  },
  footerLink: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});
