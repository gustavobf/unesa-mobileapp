import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import { createAppointment } from "../services/appointmentService";
import { getServices } from "../services/beautyService";

export default function Appointment() {
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [services, setServices] = useState<any[]>([]);

  const { user } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      const fetchServices = async () => {
        try {
          const serviceList = await getServices();
          setServices(serviceList);
        } catch (error) {
          console.error("Erro ao buscar serviços:", error);
          Alert.alert("Erro", "Não foi possível carregar os serviços.");
        }
      };

      fetchServices();
    }, [])
  );

  const openDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: dataInicio,
      mode: "date",
      minimumDate: new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          DateTimePickerAndroid.open({
            value: newDate,
            mode: "time",
            is24Hour: true,
            onChange: (event, selectedTime) => {
              if (selectedTime) {
                newDate.setHours(
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                setDataInicio(newDate);
              }
            },
          });
        }
      },
    });
  };

  const handleCreateAppointment = () => {
    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    if (!selectedService) {
      Alert.alert("Erro", "Por favor, selecione um serviço.");
      return;
    }

    try {
      const agendamento = createAppointment(
        user.username,
        selectedService,
        dataInicio
      );

      if (agendamento) {
        Alert.alert(
          "Agendamento Confirmado!",
          `Você agendou o serviço: ${
            agendamento.servico.descricao
          } para ${agendamento.dataInicioAgendamento.toLocaleString("pt-BR")}`
        );
      } else {
        Alert.alert("Erro", "Falha ao criar o agendamento. Tente novamente.");
      }
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar seu Serviço</Text>

      <Picker
        selectedValue={selectedService}
        onValueChange={(itemValue) => setSelectedService(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Escolha um serviço" value={null} />
        {services.map((service) => (
          <Picker.Item
            key={service.id}
            label={service.descricao}
            value={service.id}
          />
        ))}
      </Picker>

      <TouchableOpacity style={styles.input} onPress={openDateTimePicker}>
        <Text style={styles.dateText}>
          {dataInicio.toLocaleString("pt-BR")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCreateAppointment}>
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  picker: {
    width: "85%",
    height: 50,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  input: {
    width: "85%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  dateText: {
    fontSize: 18,
    color: "#333",
  },
  button: {
    width: "85%",
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
