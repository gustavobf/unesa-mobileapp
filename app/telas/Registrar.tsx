import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { estilosComuns } from "../estilos/estilosComuns";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import { adicionarUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";

export default function Registrar({ navigation }: any) {
  const [login, definirNomeUsuario] = useState("");
  const [senha, definirSenha] = useState("");

  const handleRegister = () => {
    if (login && senha) {
      try {
        adicionarUsuario(login, senha, PapelUsuario.CLIENTE);
        Alert.alert(
          "Cadastro bem-sucedido!",
          `Usuário ${login} criado com sucesso.`
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
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Criar Conta</Text>
      <Text style={estilosComuns.subtitulo}>
        Cadastre-se para acessar sua conta
      </Text>

      <TextInput
        placeholder="Usuário"
        value={login}
        onChangeText={definirNomeUsuario}
        style={estilosComuns.input}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={definirSenha}
        style={estilosComuns.input}
      />

      <TouchableOpacity style={estilosComuns.botao} onPress={handleRegister}>
        <Text style={estilosComuns.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>

      <View style={estilosComuns.rodape}>
        <Text style={estilosComuns.textoRodape}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.ENTRAR)}>
          <Text style={estilosComuns.linkRodape}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};