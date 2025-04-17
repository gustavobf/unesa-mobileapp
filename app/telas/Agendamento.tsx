import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { criarAgendamento } from "../servicos/agendamentoService";
import { obterServicoPorId, obterServicos } from "../servicos/procedimentoService";

export default function Appointment() {
  const [dataInicio, definirDataInicio] = useState<Date>(new Date());
  const [servicoSelecionado, definirServicoSelecionado] = useState<
    number | null
  >(null);
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
    <View style={estilosComuns.conteiner}>
      <Text style={estilosComuns.titulo}>Agendar seu Serviço</Text>

      <Picker
        selectedValue={servicoSelecionado}
        onValueChange={(itemValue) => definirServicoSelecionado(itemValue)}
        style={estilosComuns.escolha}
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

      <TouchableOpacity
        style={estilosComuns.input}
        onPress={abrirEscolhaDataHora}
      >
        <Text style={estilosComuns.textoData}>
          {dataInicio.toLocaleString("pt-BR")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={estilosComuns.botao}
        onPress={handleCreateAppointment}
      >
        <Text style={estilosComuns.textoBotao}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
};