import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { adicionarUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";

export default function Register({ navigation }: any) {
  const [nome, definirNomeUsuario] = useState("");
  const [senha, definirSenha] = useState("");

  const handleRegister = () => {
    if (nome && senha) {
      try {
        adicionarUsuario(nome, senha, PapelUsuario.CLIENTE);
        Alert.alert(
          "Cadastro bem-sucedido!",
          `Usuário ${nome} criado com sucesso.`
        );
        navigation.navigate(NOMES.ENTRAR);
      } catch (error: any) {
        Alert.alert("Erro", error.message);
      }
    } else {
      Alert.alert("Erro", "Preencha todos os campos!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Cadastre-se para acessar sua conta</Text>

      <TextInput
        placeholder="Usuário"
        value={nome}
        onChangeText={definirNomeUsuario}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={definirSenha}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.ENTRAR)}>
          <Text style={styles.footerLink}>Entrar</Text>
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
    marginBottom: 20,
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
  button: {
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
