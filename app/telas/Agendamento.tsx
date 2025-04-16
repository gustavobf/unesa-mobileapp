import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useUsuario } from "../contextos/UsuarioContext";
import { criarAgendamento } from "../servicos/agendamentoService";
import { obterServicoPorId, obterServicos } from "../servicos/opcoesService";

export default function Appointment() {
  const [dataInicio, definirDataInicio] = useState<Date>(new Date());
  const [servicoSelecionado, definirServicoSelecionado] = useState<number | null>(null);
  const [servicos, definirServicos] = useState<any[]>([]);

  const { usuario } = useUsuario();

  useFocusEffect(
    React.useCallback(() => {
      const buscarServicos = async () => {
        try {
          const listaDeServicos = obterServicos();
          definirServicos(listaDeServicos);
        } catch (erro) {
          console.error("Erro ao buscar serviços:", erro);
          Alert.alert("Erro", "Não foi possível carregar os serviços.");
        }
      };
      buscarServicos();
    }, [])
  );

  const abrirEscolhaDataHora = () => {
    DateTimePickerAndroid.open({
      value: dataInicio,
      mode: "date",
      minimumDate: new Date(),
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          const novaData = new Date(selectedDate);
          DateTimePickerAndroid.open({
            value: novaData,
            mode: "time",
            is24Hour: true,
            onChange: (event, selectedTime) => {
              if (selectedTime) {
                novaData.setHours(
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                definirDataInicio(novaData);
              }
            },
          });
        }
      },
    });
  };

  const handleCreateAppointment = () => {
    if (!usuario) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    if (!servicoSelecionado) {
      Alert.alert("Erro", "Por favor, selecione um serviço.");
      return;
    }

    try {
      const agendamento = criarAgendamento(
        usuario.id,
        servicoSelecionado,
        dataInicio
      );

      if (agendamento) {
        Alert.alert(
          "Agendamento Confirmado!",
          `Você agendou o serviço ${
            obterServicoPorId(agendamento.servicoId)?.descricao
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
        selectedValue={servicoSelecionado}
        onValueChange={(itemValue) => definirServicoSelecionado(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Escolha um serviço" value={null} />
        {servicos.map((service) => (
          <Picker.Item
            key={service.id}
            label={service.descricao}
            value={service.id}
          />
        ))}
      </Picker>

      <TouchableOpacity style={styles.input} onPress={abrirEscolhaDataHora}>
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
