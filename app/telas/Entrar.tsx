import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { entrarComUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";

export default function Entrar({ navigation }: any) {
  const [login, definirNomeUsuario] = useState("");
  const [senha, definirSenha] = useState("");
  const { definirUsuario } = useUsuario();

  const handleLogin = () => {
    if (!login || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const usuario = entrarComUsuario(login, senha);

    if (usuario) {
      definirUsuario({
        id: usuario.id,
        login: usuario.login,
        papel: usuario.papel,
        senha: usuario.senha,
        nome: usuario.nome
      });
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos.");
    }
  };

  return (
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Bem-vindo!</Text>
      <Text style={estilosComuns.subtitulo}>Faça login para continuar</Text>

      <TextInput
        style={estilosComuns.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
        value={login}
        onChangeText={definirNomeUsuario}
      />

      <TextInput
        style={estilosComuns.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senha}
        onChangeText={definirSenha}
      />

      <TouchableOpacity style={estilosComuns.botaoLogin} onPress={handleLogin}>
        <Text style={estilosComuns.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Recuperação de senha", "Função ainda não implementada!")
        }
      >
        <Text style={estilosComuns.esqueciSenha}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={estilosComuns.rodape}>
        <Text style={estilosComuns.textoRodape}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.REGISTRAR)}>
          <Text style={estilosComuns.linkRodape}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};