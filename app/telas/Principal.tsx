import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import {
  cancelaAgendamento,
  obterAgendamentorPorUsuarioId,
} from "../servicos/agendamentoService";
import { obterServicoPorId } from "../servicos/procedimentoService";
import { NOMES } from "../utilitarios/constantes";
import { Agendamento } from "../modelos/Agendamento";
import { Cores } from "../estilos/cores";

export default function Inicio({ navigation }: any) {
  const { usuario } = useUsuario();
  const [agendamentosUsuario, definirAgendamentosUsuario] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [agendamentosDaCategoria, setAgendamentosDaCategoria] = useState<
    Agendamento[]
  >([]);
  const [modalConfirmacaoVisivel, setModalConfirmacaoVisivel] = useState(false);
  const [agendamentoCancelarId, setAgendamentoCancelarId] = useState<
    number | null
  >(null);

  useFocusEffect(
    React.useCallback(() => {
      if (usuario) {
        definirAgendamentosUsuario(obterAgendamentorPorUsuarioId(usuario.id));
      } else {
        definirAgendamentosUsuario([]);
      }
    }, [usuario])
  );

  const abrirModalConfirmacao = (id: number) => {
    setAgendamentoCancelarId(id);
    setModalConfirmacaoVisivel(true);
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoVisivel(false);
  };

  const agendamentosPorCategoria = agendamentosUsuario.reduce(
    (acc: any, ag: Agendamento) => {
      const serv = obterServicoPorId(ag.servicoId);
      const cat = serv?.categoria ?? "Outros";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(ag);
      return acc;
    },
    {}
  );

  const cancelarAgendamento = () => {
    if (agendamentoCancelarId !== null) {
      cancelaAgendamento(agendamentoCancelarId);

      definirAgendamentosUsuario((anterior) =>
        anterior.filter((item) => item.id !== agendamentoCancelarId)
      );

      setAgendamentosDaCategoria((anterior) => {
        const novaLista = anterior.filter(
          (item) => item.id !== agendamentoCancelarId
        );

        if (novaLista.length === 0) {
          setModalVisible(false);
        }

        return novaLista;
      });
      setAgendamentoCancelarId(null);
      setModalConfirmacaoVisivel(false);
    }
  };

  const openModal = (categoria: string) => {
    setAgendamentosDaCategoria(agendamentosPorCategoria[categoria]);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={estilosComuns.conteiner}>
      <ScrollView contentContainerStyle={estilosComuns.scrollConteiner}>
        {usuario ? (
          <>
            <Text style={estilosComuns.textoComum}>
              Olá, {usuario.nome}!{"\n"}Bem‑vindo à sua página de agendamentos.
            </Text>

            {Object.keys(agendamentosPorCategoria).length > 0 ? (
              <View style={estilosComuns.listaAgendamentoCliente}>
                <Text style={[estilosComuns.titulo, { textAlign: "center" }]}>
                  Suas Categorias
                </Text>
                {Object.keys(agendamentosPorCategoria).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={estilosComuns.botao}
                    onPress={() => openModal(cat)}
                  >
                    <Text style={estilosComuns.textoBotao}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={estilosComuns.textoSemAgendamentos}>
                Você ainda não tem agendamentos. Que tal agendar um serviço?
              </Text>
            )}

            {agendamentosUsuario.length === 0 && (
              <TouchableOpacity
                style={estilosComuns.botao}
                onPress={() => navigation.navigate(NOMES.AGENDAMENTO)}
              >
                <Text style={estilosComuns.textoBotao}>Agendar Serviço</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={estilosComuns.textoComum}>
            Por favor, faça login para continuar.
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={estilosComuns.fundoModalAgendamentosCliente}>
          <View style={estilosComuns.conteinerModalAgendamentosCliente}>
            <Text style={estilosComuns.tituloModalAgendamento}>
              Agendamentos
            </Text>

            <ScrollView
              style={estilosComuns.scrollModalAgendamentos}
              contentContainerStyle={estilosComuns.conteudoModalAgendamento}
              keyboardShouldPersistTaps="handled"
            >
              {agendamentosDaCategoria.map((item) => (
                <View key={item.id} style={estilosComuns.itemAgendamento}>
                  <Text style={estilosComuns.textoAgendamento}>
                    <Text style={estilosComuns.textoNegrito}>Serviço:</Text>{" "}
                    {obterServicoPorId(item.servicoId)?.descricao}
                  </Text>
                  <Text style={estilosComuns.textoAgendamento}>
                    <Text style={estilosComuns.textoNegrito}>Data:</Text>{" "}
                    {item.dataInicioAgendamento.toLocaleString("pt-BR")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      estilosComuns.botao,
                      { backgroundColor: Cores.erro },
                    ]}
                    onPress={() => abrirModalConfirmacao(item.id)}
                  >
                    <Text style={estilosComuns.textoBotao}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={estilosComuns.botao}
              onPress={() => setModalVisible(false)}
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
