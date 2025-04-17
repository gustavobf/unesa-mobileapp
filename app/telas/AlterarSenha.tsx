import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
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

    const sucess = trocarSenha(usuario.login, usuario.senha, newPassword);

    if (sucess) {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.replace(NOMES.ABAS);
    } else {
      Alert.alert("Erro", "Usuário não encontrado.");
    }
  };

  const handleLogout = () => {
    definirUsuario(null);
  };

  return (
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Trocar Senha</Text>
      <Text style={estilosComuns.textoBemVindo}>Olá, {usuario?.login}!</Text>

      <TextInput
        style={estilosComuns.input}
        placeholder="Senha Atual"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={estilosComuns.input}
        placeholder="Nova Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        style={estilosComuns.input}
        placeholder="Confirmar Nova Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={estilosComuns.botaoSenha}
        onPress={handleChangePassword}
      >
        <Text style={estilosComuns.textoBotao}>Alterar Senha</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[estilosComuns.botaoSenha, estilosComuns.botaoSair]}
        onPress={handleLogout}
      >
        <Text style={estilosComuns.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};