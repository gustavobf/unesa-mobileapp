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
import { useUser } from "../contexts/UserContext";
import {
  getAppointments,
  deleteAppointment,
} from "../services/appointmentService";
import { createBeautyService } from "../services/beautyService";

export default function HomeAdmin({ navigation }: any) {
  const { user } = useUser();
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [serviceCategory, setServiceCategory] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [totalGanhos, setTotalGanhos] = useState(0);

  const handleCreateService = () => {
    if (
      !serviceCategory ||
      !servicePrice ||
      !serviceDescription ||
      !serviceDuration
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const newService = createBeautyService(
      serviceCategory,
      parseFloat(servicePrice),
      serviceDescription,
      parseInt(serviceDuration, 10)
    );

    if (newService) {
      Alert.alert(
        "Serviço Criado",
        `Serviço ${newService.descricao} criado com sucesso!`
      );
      setServiceCategory("");
      setServicePrice("");
      setServiceDescription("");
      setServiceDuration("");
      setIsCreatingService(false);
    } else {
      Alert.alert("Erro", "Não foi possível criar o serviço.");
    }
  };

  const handleCompleteAppointment = (id: number) => {
    deleteAppointment(id);
    setUserAppointments((prev) => prev.filter((item) => item.id !== id));
  };

  useFocusEffect(
    React.useCallback(() => {
      const appointments = getAppointments().sort((a, b) => {
        const dateA = new Date(a.dataInicioAgendamento);
        const dateB = new Date(b.dataInicioAgendamento);
        return dateA.getTime() - dateB.getTime();
      });

      setUserAppointments(appointments);

      const total = appointments.reduce(
        (acc, item) => acc + item.servico.preco,
        0
      );
      setTotalGanhos(total);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          {userAppointments.length > 0 ? (
            <View style={styles.appointmentList}>
              <Text style={styles.listTitle}>Agendamentos:</Text>
              <FlatList
                data={userAppointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.appointmentItem}>
                    <Text style={styles.appointmentText}>
                      Usuário: {item.usuario}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Serviço: {item.servico.descricao}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Data: {item.dataInicioAgendamento.toLocaleString("pt-BR")}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Fim: {item.dataFimAgendamento.toLocaleString("pt-BR")}
                    </Text>
                    <Text style={styles.appointmentText}>
                      Preço: R${item.servico.preco.toFixed(2).replace(".", ",")}
                    </Text>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleCompleteAppointment(item.id)}
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
            onPress={() => setIsCreatingService(true)}
          >
            <Text style={styles.buttonText}>Criar Novo Serviço</Text>
          </TouchableOpacity>

          <Modal
            visible={isCreatingService}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsCreatingService(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.formTitle}>Novo Serviço</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Categoria"
                  value={serviceCategory}
                  onChangeText={setServiceCategory}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Preço"
                  value={servicePrice}
                  onChangeText={setServicePrice}
                  keyboardType="numeric"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Descrição"
                  value={serviceDescription}
                  onChangeText={setServiceDescription}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Duração (minutos)"
                  value={serviceDuration}
                  onChangeText={setServiceDuration}
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
                  onPress={() => setIsCreatingService(false)}
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
