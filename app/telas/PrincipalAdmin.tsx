import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { Agendamento } from "../modelos/Agendamento";
import {
  excluirAgendamento,
  obterAgendamentos,
} from "../servicos/agendamentoService";
import { criarNovoProcedimento, obterServicoPorId } from "../servicos/procedimentoService";
import { obterUsuarioPorId } from "../servicos/usuarioService";

export default function PrincipalAdmin({ navigation }: any) {
  const { usuario } = useUsuario();
  const [agendamentosUsuario, definirAgendamentosUsuario] = useState<any[]>([]);
  const [estaCriandoOpcao, definirEstaCriandoOpcao] = useState(false);
  const [opcaoCategoria, definirCategoriaOpcao] = useState("");
  const [opcaoPreco, definirPrecoOpcao] = useState("");
  const [opcaoDescricao, definirDescricaoOpcao] = useState("");
  const [opcaoDuracao, definirDuracaoOpcao] = useState("");

  const handleCreateService = () => {
    if (!opcaoCategoria || !opcaoPreco || !opcaoDescricao || !opcaoDuracao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const novaOpcao = criarNovoProcedimento(
      opcaoCategoria,
      parseFloat(opcaoPreco),
      opcaoDescricao,
      parseInt(opcaoDuracao, 10)
    );

    if (novaOpcao) {
      Alert.alert(
        "Serviço Criado",
        `Serviço ${novaOpcao.descricao} criado com sucesso!`
      );
      definirCategoriaOpcao("");
      definirPrecoOpcao("");
      definirDescricaoOpcao("");
      definirDuracaoOpcao("");
      definirEstaCriandoOpcao(false);
    } else {
      Alert.alert("Erro", "Não foi possível criar o serviço.");
    }
  };

  const tratarAgendamentoCompleto = (id: number) => {
    excluirAgendamento(id);
    definirAgendamentosUsuario((prev) => prev.filter((item) => item.id !== id));
  };

  useFocusEffect(
    React.useCallback(() => {
      definirAgendamentosUsuario(obterAgendamentos);
    }, [])
  );

  return (
    <SafeAreaView>
      {usuario ? (
        <FlatList
          data={agendamentosUsuario}
          keyExtractor={(item: Agendamento) => item.id.toString()}
          ListHeaderComponent={
            <>
              <Text style={estilosComuns.textoBemVindo}>
                Olá, {usuario.nome}! {"\n"}Bem-vindo ao painel administrativo.
              </Text>

              {agendamentosUsuario.length > 0 ? (
                <Text style={estilosComuns.titulo}>Agendamentos:</Text>
              ) : (
                <Text style={estilosComuns.textoSemAgendamentos}>
                  Não há agendamentos no momento.
                </Text>
              )}
            </>
          }
          renderItem={({ item }) => (
            <View style={estilosComuns.itemAgendamento}>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Usuário:</Text>{" "}
                {obterUsuarioPorId(item.usuarioId)!.nome}
              </Text>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Serviço:</Text>{" "}
                {obterServicoPorId(item.servicoId)!.descricao}
              </Text>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Início:</Text>{" "}
                {item.dataInicioAgendamento.toLocaleString("pt-BR")}
              </Text>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Fim:</Text>{" "}
                {item.dataFimAgendamento.toLocaleString("pt-BR")}
              </Text>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Preço:</Text>{" R$"}
                {obterServicoPorId(item.servicoId)!
                  .preco.toFixed(2)
                  .replace(".", ",")}
              </Text>
              <TouchableOpacity
                style={estilosComuns.botao}
                onPress={() => tratarAgendamentoCompleto(item.id)}
              >
                <Text style={estilosComuns.textoBotao}>Concluir</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={estilosComuns.botao}
              onPress={() => definirEstaCriandoOpcao(true)}
            >
              <Text style={estilosComuns.textoBotao}>Criar Novo Serviço</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={estilosComuns.scrollContainer}
        />
      ) : (
        <Text style={estilosComuns.textoBemVindo}>Usuário não logado</Text>
      )}

      <Modal
        visible={estaCriandoOpcao}
        animationType="slide"
        transparent={true}
        onRequestClose={() => definirEstaCriandoOpcao(false)}
      >
        <View style={estilosComuns.conteinerModal}>
          <View style={estilosComuns.conteudoModal}>
            <Text style={estilosComuns.formularioTitulo}>Novo Serviço</Text>
            <TextInput
              style={estilosComuns.input}
              placeholder="Categoria"
              value={opcaoCategoria}
              onChangeText={definirCategoriaOpcao}
            />
            <TextInput
              style={estilosComuns.input}
              placeholder="Preço"
              value={opcaoPreco}
              onChangeText={definirPrecoOpcao}
              keyboardType="numeric"
            />
            <TextInput
              style={estilosComuns.input}
              placeholder="Descrição"
              value={opcaoDescricao}
              onChangeText={definirDescricaoOpcao}
            />
            <TextInput
              style={estilosComuns.input}
              placeholder="Duração (minutos)"
              value={opcaoDuracao}
              onChangeText={definirDuracaoOpcao}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={estilosComuns.botao}
              onPress={handleCreateService}
            >
              <Text style={estilosComuns.textoBotao}>Salvar Serviço</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={estilosComuns.botaoCancelar}
              onPress={() => definirEstaCriandoOpcao(false)}
            >
              <Text style={estilosComuns.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
