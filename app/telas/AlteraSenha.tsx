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
import { trocarSenha } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";

export default function ChangePassword({ navigation }: any) {
  const { usuario, definirUsuario } = useUsuario();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas novas não coincidem!");
      return;
    }

    if (usuario && usuario.senha !== currentPassword) {
      Alert.alert("Erro", "Senha atual incorreta!");
      return;
    }

    if (!usuario) {
      Alert.alert("Erro", "Usuário não encontrado!");
      return;
    }

    const sucess = trocarSenha(usuario.nome, usuario.senha, newPassword);

    if (sucess) {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.replace(NOMES.INICIO);
    } else {
      Alert.alert("Erro", "Usuário não encontrado.");
    }
  };

  const handleLogout = () => {
    definirUsuario(null);
    navigation.replace(NOMES.ENTRAR);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trocar Senha</Text>
      <Text style={styles.welcomeText}>Olá, {usuario?.nome}!</Text>

      <TextInput
        style={styles.input}
        placeholder="Senha Atual"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar Nova Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Alterar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginTop: 20,
  },
});
