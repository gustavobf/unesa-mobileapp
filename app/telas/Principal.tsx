import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { estilosComuns } from "../estilos/estilosComuns";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";
import { obterAgendamentorPorUsuarioId } from "../servicos/agendamentoService";
import { obterServicoPorId } from "../servicos/procedimentoService";
import { NOMES } from "../utilitarios/constantes";

export default function Inicio({ navigation }: any) {
  const { usuario } = useUsuario();
  const [usuarioAppointments, setusuarioAppointments] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (usuario) {
        const appointments = obterAgendamentorPorUsuarioId(usuario.id);
        setusuarioAppointments(appointments);
      } else {
        setusuarioAppointments([]);
      }
    }, [usuario])
  );

  return (
    <SafeAreaView style={estilosComuns.conteiner}>
      <ScrollView contentContainerStyle={estilosComuns.scrollContainer}>
        {usuario ? (
          <>
            <Text style={estilosComuns.textoBemVindo}>
              Olá, {usuario.nome}! {"\n"}Bem-vindo à sua página de
              agendamentos.
            </Text>
            {usuarioAppointments.length > 0 ? (
              <View style={estilosComuns.listaAgendamento}>
                <Text style={estilosComuns.listaTitulo}>
                  Seus Agendamentos:
                </Text>
                {usuarioAppointments.map((item) => (
                  <View key={item.id} style={estilosComuns.itemAgendamento}>
                    <Text style={estilosComuns.textoAgendamento}>
                      <Text style={estilosComuns.textoNegrito}>Serviço:</Text>{" "}
                      {obterServicoPorId(item.servicoId)?.descricao}
                    </Text>
                    <Text style={estilosComuns.textoAgendamento}>
                      <Text style={estilosComuns.textoNegrito}>Data:</Text>{" "}
                      {item.dataInicioAgendamento.toLocaleString("pt-BR")}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={estilosComuns.textoSemAgendamentos}>
                Você ainda não tem agendamentos. Que tal agendar um serviço?
              </Text>
            )}

            {usuarioAppointments.length === 0 && (
              <TouchableOpacity
                style={estilosComuns.botao}
                onPress={() => navigation.navigate(NOMES.AGENDAMENTO)}
              >
                <Text style={estilosComuns.textoBotao}>Agendar Serviço</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={estilosComuns.textoBemVindo}>
            Por favor, faça login para continuar.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};