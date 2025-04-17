import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { trocarSenha } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";
import { Cores } from "../estilos/cores";

export default function TrocarSenha({ navigation }: any) {
  const { usuario, definirUsuario } = useUsuario();
  const [senhaAtual, definirSenhaAtual] = useState("");
  const [novaSenha, definirNovaSenha] = useState("");
  const [confirmarSenha, definirConfirmarSenha] = useState("");

  const [animacaoVisibilidade, setAnimacaoVisibilidade] = useState(new Animated.Value(0));
  const [animacaoBotao] = useState(new Animated.Value(0));

  const tratarTrocaSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas novas não coincidem!");
      return;
    }

    if (usuario && usuario.senha !== senhaAtual) {
      Alert.alert("Erro", "Senha atual incorreta!");
      return;
    }

    if (!usuario) {
      Alert.alert("Erro", "Usuário não encontrado!");
      return;
    }

    const sucess = trocarSenha(usuario.login, usuario.senha, novaSenha);

    if (sucess) {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      navigation.replace(NOMES.ABAS);
    } else {
      Alert.alert("Erro", "Não foi possível alterar a senha.");
    }
  };

  const tratarLogout = () => {
    definirUsuario(null);
  };

  useEffect(() => {
    Animated.timing(animacaoVisibilidade, {
      toValue: novaSenha.length > 0 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(animacaoBotao, {
      toValue: senhaAtual.length > 0 && novaSenha.length > 0 && confirmarSenha.length > 0 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [novaSenha, confirmarSenha]);

  const translateY = animacaoVisibilidade.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animacaoVisibilidade.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateYBotao = animacaoBotao.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacityBotao = animacaoBotao.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Trocar Senha</Text>
      <Text style={estilosComuns.textoComum}>Olá, {usuario?.nome}!</Text>

      <TextInput
        style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
        placeholder="Senha Atual"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={senhaAtual}
        onChangeText={definirSenhaAtual}
      />

      <TextInput
        style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
        placeholder="Nova Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={novaSenha}
        onChangeText={definirNovaSenha}
      />

      {novaSenha.length > 0 && (
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
            width: "100%",
            overflow: "hidden",
          }}
        >
          <TextInput
            style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
            placeholder="Confirmar Nova Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={definirConfirmarSenha}
          />
        </Animated.View>
      )}

      <Animated.View
        style={{
          opacity: opacityBotao,
          transform: [{ translateY: translateYBotao }],
          width: "100%",
          display: senhaAtual.length > 0 && novaSenha.length > 0 && confirmarSenha.length > 0 ? "flex" : "none",
        }}
      >
        <TouchableOpacity
          style={[estilosComuns.botao, { backgroundColor: Cores.primario }]}
          onPress={tratarTrocaSenha}
        >
          <Text style={estilosComuns.textoBotao}>Alterar Senha</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={[estilosComuns.botao, estilosComuns.botaoLogout, { backgroundColor: Cores.erro }]}
        onPress={tratarLogout}
      >
        <Text style={estilosComuns.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
