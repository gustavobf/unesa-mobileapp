import React, { useEffect, useState } from "react";
import { Alert, Animated, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { Cores } from "../estilos/cores";
import { estilosComuns } from "../estilos/estilosComuns";
import { entrarComUsuario } from "../servicos/usuarioService";
import { NOMES } from "../utilitarios/constantes";

export default function Entrar({ navigation }: any) {
  const [login, definirNomeUsuario] = useState("");
  const [senha, definirSenha] = useState("");
  const [mostrarModal, definirMostrarModal] = useState(false);
  const [emailRecuperacao, definirEmailRecuperacao] = useState("");

  const { definirUsuario } = useUsuario();

  const [animacaoSenha] = useState(new Animated.Value(0));
  const [animacaoBotao] = useState(new Animated.Value(0));

  useEffect(() => {
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

  const translateY = animacaoSenha.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const opacity = animacaoSenha.interpolate({
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

  const tratarLogin = () => {
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
        nome: usuario.nome,
      });
    } else {
      Alert.alert("Erro", "Usuário ou senha incorretos.");
    }
  };

  const tratarTrocaLogin = (novoLogin: string) => {
    definirNomeUsuario(novoLogin);
    if (novoLogin === "") {
      definirSenha("");
    }
  };

  const abrirModalRecuperacao = () => {
    definirMostrarModal(true);
  };

  const fecharModalRecuperacao = () => {
    definirMostrarModal(false);
  };

  const enviarEmailRecuperacao = () => {
    if (!emailRecuperacao) {
      Alert.alert("Erro", "Por favor, insira um e-mail.");
      return;
    }

    Alert.alert("Sucesso", `E-mail de recuperação enviado para ${emailRecuperacao}.`);
    definirMostrarModal(false);
  };

  return (
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Bem-vindo!</Text>
      <Text style={estilosComuns.subtitulo}>Faça login para continuar</Text>

      <TextInput
        style={estilosComuns.input}
        placeholder="Usuário"
        placeholderTextColor={Cores.textoClaro}
        value={login}
        onChangeText={tratarTrocaLogin}
      />

      {login.length > 0 && (
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
            width: "100%",
            overflow: "hidden",
          }}
        >
          <TextInput
            style={estilosComuns.input}
            placeholder="Digite sua senha"
            placeholderTextColor={Cores.textoClaro}
            secureTextEntry
            value={senha}
            onChangeText={definirSenha}
          />
        </Animated.View>
      )}

      <Animated.View
        style={{
          opacity: opacityBotao,
          transform: [{ translateY: translateYBotao }],
          width: "100%",
          display: login.length > 0 && senha.length > 0 ? "flex" : "none",
        }}
      >
        <TouchableOpacity style={estilosComuns.botaoLogin} onPress={tratarLogin}>
          <Text style={estilosComuns.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={abrirModalRecuperacao}>
        <Text style={estilosComuns.esqueciSenha}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <View style={estilosComuns.rodape}>
        <Text style={estilosComuns.textoRodape}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(NOMES.REGISTRAR)}>
          <Text style={estilosComuns.linkRodape}>Criar conta</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={mostrarModal}
        onRequestClose={fecharModalRecuperacao}
      >
        <View style={estilosComuns.conteinerModalRecuperarSenha}>
          <View style={estilosComuns.conteudoModalRecuperarSenha}>
            <Text style={estilosComuns.tituloModalRecuperarSenha}>Recuperação de Senha</Text>
            <TextInput
              style={estilosComuns.inputModalRecuperarSenha}
              placeholder="Digite seu e-mail"
              placeholderTextColor={Cores.textoClaro}
              value={emailRecuperacao}
              onChangeText={definirEmailRecuperacao}
            />
            <TouchableOpacity style={estilosComuns.botaoModalRecuperarSenha} onPress={enviarEmailRecuperacao}>
              <Text style={estilosComuns.textoBotaoModalRecuperarSenha}>Enviar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={fecharModalRecuperacao}>
              <Text style={estilosComuns.fecharModalRecuperarSenha}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
