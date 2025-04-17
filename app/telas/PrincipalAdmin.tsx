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
  View,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { Agendamento } from "../modelos/Agendamento";
import {
  concluirAgendamento,
  obterAgendamentos,
  obterGanhoDoDia,
  registrarGanhoDoDia,
  listarGanhos,
  cancelaAgendamento,
} from "../servicos/agendamentoService";
import {
  criarNovoProcedimento,
  obterServicoPorId,
} from "../servicos/procedimentoService";
import { obterUsuarioPorId } from "../servicos/usuarioService";
import { Cores } from "../estilos/cores";

export default function PrincipalAdmin({ navigation }: any) {
  const { usuario } = useUsuario();
  const [agendamentosUsuario, definirAgendamentosUsuario] = useState<any[]>([]);
  const [ganhosTotais, definirGanhosTotaisPorDia] = useState(0);
  const [estaCriandoOpcao, definirEstaCriandoOpcao] = useState(false);
  const [opcaoCategoria, definirCategoriaOpcao] = useState("");
  const [opcaoPreco, definirPrecoOpcao] = useState("");
  const [opcaoDescricao, definirDescricaoOpcao] = useState("");
  const [opcaoDuracao, definirDuracaoOpcao] = useState("");
  const [modalGanhosVisivel, setModalGanhosVisivel] = useState(false);
  const [ganhosPorDia, setGanhosPorDia] = useState<
    { data: string; valor: number }[]
  >([]);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [agendamentoCancelarId, setAgendamentoCancelarId] = useState<
    number | null
  >(null);

  const tratarCriacaoProcedimento = () => {
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

  const abrirModalConfirmacao = (id: number) => {
    setAgendamentoCancelarId(id);
    setModalConfirmacaoVisivel(true);
  };

  const tratarAgendamentoCompleto = (id: number) => {
    const agendamento = agendamentosUsuario.find((item) => item.id === id);
    if (!agendamento) return;

    const servico = obterServicoPorId(agendamento.servicoId);
    if (!servico) return;

    concluirAgendamento(id);

    const ganhoDoDia = obterGanhoDoDia();
    const novoGanho = ganhoDoDia
      ? ganhoDoDia.valor + servico.preco
      : servico.preco;

    registrarGanhoDoDia(novoGanho);

    const ganhoAtualizado = obterGanhoDoDia();
    definirGanhosTotaisPorDia(ganhoAtualizado ? ganhoAtualizado.valor : 0);

    definirAgendamentosUsuario((anterior) =>
      anterior.filter((item) => item.id !== id)
    );
  };

  const abrirModalGanhos = () => {
    const ganhos = listarGanhos().map((ganho) => ({
      data: ganho.data.toLocaleDateString("pt-BR"),
      valor: ganho.valor,
    }));

    setGanhosPorDia(ganhos);
    setModalGanhosVisivel(true);
  };
  const cancelarAgendamento = () => {
    if (agendamentoCancelarId !== null) {
      cancelaAgendamento(agendamentoCancelarId);
    }
    setModalConfirmacaoVisivel(false);
    definirAgendamentosUsuario((anterior) =>
      anterior.filter((item) => item.id !== agendamentoCancelarId)
    );
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoVisivel(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      const agendamentos = obterAgendamentos();
      definirAgendamentosUsuario(agendamentos);

      const ganho = obterGanhoDoDia();
      definirGanhosTotaisPorDia(ganho.valor);
    }, [])
  );

  return (
    <SafeAreaView style={estilosComuns.conteiner}>
      {usuario ? (
        <FlatList
          data={agendamentosUsuario}
          keyExtractor={(item: Agendamento) => item.id.toString()}
          ListHeaderComponent={
            <View style={{ marginBottom: 20 }}>
              <Text style={estilosComuns.textoComum}>
                Olá, {usuario.nome}! {"\n"}Bem-vindo ao painel administrativo.
              </Text>
              <View
                style={{
                  backgroundColor: Cores.sucessoClaro ?? "#d4edda",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                }}
              >
                <Text
                  style={[
                    estilosComuns.textoNegrito,
                    { color: Cores.sucesso ?? "#155724" },
                  ]}
                >
                  Ganhos totais do dia: R${" "}
                  {ganhosTotais.toFixed(2).replace(".", ",")}
                </Text>
              </View>

              {agendamentosUsuario.length > 0 ? (
                <Text style={estilosComuns.titulo}>Agendamentos:</Text>
              ) : (
                <Text style={estilosComuns.textoSemAgendamentos}>
                  Não há agendamentos no momento.
                </Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={estilosComuns.itemAgendamento}>
              <Text style={estilosComuns.textoAgendamento}>
                <Text style={estilosComuns.textoNegrito}>Cliente:</Text>{" "}
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
                <Text style={estilosComuns.textoNegrito}>Preço:</Text> R$
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
              <TouchableOpacity
                style={[estilosComuns.botao, { backgroundColor: Cores.erro }]}
                onPress={() => abrirModalConfirmacao(item.id)}
              >
                <Text style={estilosComuns.textoBotao}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={estilosComuns.botao}
                onPress={() => definirEstaCriandoOpcao(true)}
              >
                <Text style={estilosComuns.textoBotao}>Criar Novo Serviço</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={estilosComuns.botao}
                onPress={abrirModalGanhos}
              >
                <Text style={estilosComuns.textoBotao}>Ver Ganhos por Dia</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={estilosComuns.scrollConteiner}
        />
      ) : (
        <Text style={estilosComuns.textoComum}>Usuário não logado</Text>
      )}

      <Modal
        visible={estaCriandoOpcao}
        animationType="slide"
        transparent={true}
        onRequestClose={() => definirEstaCriandoOpcao(false)}
      >
        <View style={estilosComuns.conteinerModalNovoServico}>
          <View style={estilosComuns.conteudoModalNovoServico}>
            <Text style={estilosComuns.modalTituloNovoServico}>
              Novo Serviço
            </Text>
            <TextInput
              style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
              placeholder="Categoria"
              value={opcaoCategoria}
              onChangeText={definirCategoriaOpcao}
            />
            <TextInput
              style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
              placeholder="Preço"
              value={opcaoPreco}
              onChangeText={definirPrecoOpcao}
              keyboardType="numeric"
            />
            <TextInput
              style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
              placeholder="Descrição"
              value={opcaoDescricao}
              onChangeText={definirDescricaoOpcao}
            />
            <TextInput
              style={[estilosComuns.input, { backgroundColor: Cores.branco }]}
              placeholder="Duração (minutos)"
              value={opcaoDuracao}
              onChangeText={definirDuracaoOpcao}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[estilosComuns.botao, { backgroundColor: Cores.primario }]}
              onPress={tratarCriacaoProcedimento}
            >
              <Text style={estilosComuns.textoBotao}>Salvar Serviço</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[estilosComuns.botao, { backgroundColor: Cores.erro }]}
              onPress={() => definirEstaCriandoOpcao(false)}
            >
              <Text style={estilosComuns.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalGanhosVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalGanhosVisivel(false)}
      >
        <View style={estilosComuns.conteinerModalNovoServico}>
          <View
            style={[
              estilosComuns.conteudoModalNovoServico,
              { maxHeight: "80%", paddingBottom: 20 },
            ]}
          >
            <Text style={estilosComuns.modalTituloNovoServico}>
              Ganhos por Dia
            </Text>
            <FlatList
              data={ganhosPorDia}
              keyExtractor={(item) => item.data}
              renderItem={({ item }) => (
                <Text style={estilosComuns.textoComum}>
                  {item.data.split("-").reverse().join("/")} — R${" "}
                  {item.valor.toFixed(2).replace(".", ",")}
                </Text>
              )}
            />
            <TouchableOpacity
              style={[estilosComuns.botao, { marginTop: 10 }]}
              onPress={() => setModalGanhosVisivel(false)}
            >
              <Text style={estilosComuns.textoBotao}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalConfirmacaoVisivel}
        animationType="fade"
        transparent={true}
        onRequestClose={fecharModalConfirmacao}
      >
        <View
          style={[
            estilosComuns.conteinerModalNovoServico,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <View
            style={[
              estilosComuns.conteudoModalNovoServico,
              {
                maxHeight: "70%",
                width: "90%",
                padding: 20,
                alignItems: "center",
                borderRadius: 10,
              },
            ]}
          >
            <Text style={estilosComuns.modalTituloNovoServico}>
              Tem certeza que deseja cancelar este agendamento?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
              }}
            >
              <TouchableOpacity
                style={[
                  estilosComuns.botao,
                  { backgroundColor: Cores.erro, flex: 1, marginRight: 10 },
                ]}
                onPress={cancelarAgendamento}
              >
                <Text style={estilosComuns.textoBotao}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  estilosComuns.botao,
                  { backgroundColor: Cores.primario, flex: 1, marginLeft: 10 },
                ]}
                onPress={fecharModalConfirmacao}
              >
                <Text style={estilosComuns.textoBotao}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
