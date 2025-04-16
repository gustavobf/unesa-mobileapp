import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import {
  excluirAgendamento,
  obterAgendamentos,
} from "../servicos/agendamentoService";
import { criarNovaOpcao, obterServicoPorId } from "../servicos/opcoesService";
import { Agendamento } from "../modelos/Agendamento";
import { obterUsuarioPorId } from "../servicos/usuarioService";

export default function HomeAdmin({ navigation }: any) {
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

    const novaOpcao = criarNovaOpcao(
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
      const agendamentos = obterAgendamentos().sort((a, b) => {
        const dataA = new Date(a.dataInicioAgendamento);
        const dataB = new Date(b.dataInicioAgendamento);
        return dataA.getTime() - dataB.getTime();
      });

      definirAgendamentosUsuario(agendamentos);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {usuario ? (
        <>
          {agendamentosUsuario.length > 0 ? (
            <View style={styles.appointmentList}>
              <Text style={styles.listTitle}>Agendamentos:</Text>
              <FlatList
                data={agendamentosUsuario}
                keyExtractor={(item: Agendamento) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.appointmentItem}>
                    <Text style={styles.appointmentText}>
                      Usuário: {obterUsuarioPorId(item.usuarioId)!.nome}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Serviço: {obterServicoPorId(item.servicoId)!.descricao}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Data: {item.dataInicioAgendamento.toLocaleString("pt-BR")}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Fim: {item.dataFimAgendamento.toLocaleString("pt-BR")}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Preço: R${obterServicoPorId(item.servicoId)!.preco.toFixed(2).replace(".", ",")}
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => tratarAgendamentoCompleto(item.id)}
                    >
                      <Text style={styles.buttonText}>Concluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          ) : (
            <Text style={styles.noAppointmentsText}>
              Não há agendamentos no momento.
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => definirEstaCriandoOpcao(true)}
          >
            <Text style={styles.buttonText}>Criar Novo Serviço</Text>
          </TouchableOpacity>

          <Modal
            visible={estaCriandoOpcao}
            animationType="slide"
            transparent={true}
            onRequestClose={() => definirEstaCriandoOpcao(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.formTitle}>Novo Serviço</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Categoria"
                  value={opcaoCategoria}
                  onChangeText={definirCategoriaOpcao}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Preço"
                  value={opcaoPreco}
                  onChangeText={definirPrecoOpcao}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descrição"
                  value={opcaoDescricao}
                  onChangeText={definirDescricaoOpcao}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Duração (minutos)"
                  value={opcaoDuracao}
                  onChangeText={definirDuracaoOpcao}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateService}
                >
                  <Text style={styles.buttonText}>Salvar Serviço</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => definirEstaCriandoOpcao(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <Text style={styles.welcomeText}>Usuário não logado</Text>
      )}
    </SafeAreaView>
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
  welcomeText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    fontWeight: "500",
  },
  appointmentList: {
    width: "100%",
    marginTop: 20,
  },
  listTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  appointmentItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  appointmentText: {
    fontSize: 16,
    color: "#333",
  },
  noAppointmentsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceForm: {
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  cancelButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#f44336",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalGanhosContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  totalGanhosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
