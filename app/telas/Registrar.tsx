import React, { useState, useEffect } from "react";
import {
  Alert,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { estilosComuns } from "../estilos/estilosComuns";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import { adicionarUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";
import { Cores } from "../estilos/cores";

export default function Registrar({ navigation }: any) {
  const [login, definirNomeUsuario] = useState("");
  const [senha, definirSenha] = useState("");

  const [animacaoLogin] = useState(new Animated.Value(1));
  const [animacaoSenha] = useState(new Animated.Value(0));
  const [animacaoBotao] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animacaoLogin, {
      toValue: login.length > 0 ? 1 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(animacaoSenha, {
      toValue: login.length > 0 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(animacaoBotao, {
      toValue: login.length > 0 && senha.length > 0 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [login, senha]);

  const translateYLogin = animacaoLogin.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const translateYSenha = animacaoSenha.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const translateYBotao = animacaoBotao.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const tratarNovoUsuario = () => {
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
    <View style={{ ...estilosComuns.conteiner, backgroundColor: Cores.branco }}>
      <Text style={{ ...estilosComuns.titulo, color: Cores.primario }}>Criar Conta</Text>
      <Text style={{ ...estilosComuns.subtitulo, color: Cores.textoClaro }}>
        Cadastre-se para acessar sua conta
      </Text>

      <Animated.View
        style={{
          opacity: 1,
          transform: [{ translateY: translateYLogin }],
          width: "100%",
        }}
      >
        <TextInput
          placeholder="Usuário"
          value={login}
          onChangeText={definirNomeUsuario}
          style={{
            ...estilosComuns.input,
            backgroundColor: Cores.branco,
            color: Cores.texto,
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: animacaoSenha,
          transform: [{ translateY: translateYSenha }],
          width: "100%",
          display: login.length > 0 ? "flex" : "none",
        }}
      >
        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={definirSenha}
          style={{
            ...estilosComuns.input,
            backgroundColor: Cores.branco,
            color: Cores.textoClaro,
          }}
        />
      </Animated.View>

      <Animated.View
        style={{
          opacity: animacaoBotao,
          transform: [{ translateY: translateYBotao }],
          width: "100%",
          display: login.length > 0 && senha.length > 0 ? "flex" : "none",
        }}
      >
        <TouchableOpacity
          style={{
            ...estilosComuns.botao,
            backgroundColor: Cores.primario,
          }}
          onPress={tratarNovoUsuario}
        >
          <Text style={{ ...estilosComuns.textoBotao, color: Cores.branco }}>
            Cadastrar
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={estilosComuns.rodape}>
        <Text style={estilosComuns.textoRodape}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.ENTRAR)}>
          <Text style={{ ...estilosComuns.linkRodape, color: Cores.primario }}>
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
