import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUsuario } from "../contextos/UsuarioContext";
import { Agendamento } from "../modelos/Agendamento";
import { obterAgendamentorPorUsuarioId } from "../servicos/agendamentoService";
import { obterServicoPorId } from "../servicos/opcoesService";
import { NOMES } from "../utilitarios/constantes";
import { PapelUsuario } from "../modelos/enumerados/PapelUsuario";

export default function Home({ navigation }: any) {
  const { usuario } = useUsuario();
  const papelDescription = usuario
    ? PapelUsuario.obterDescricao(Number(usuario.papel))
    : "Desconhecido";

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
    <View style={styles.container}>
      {usuario ? (
        <>
          <Text style={styles.welcomeText}>
            Olá, {papelDescription}! {"\n"} Bem-vindo à sua página de
            agendamentos.
          </Text>

          {usuarioAppointments.length > 0 ? (
            <View style={styles.appointmentList}>
              <Text style={styles.listTitle}>Seus Agendamentos:</Text>
              <FlatList
                data={usuarioAppointments}
                keyExtractor={(item: Agendamento) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.appointmentItem}>
                    <Text style={styles.appointmentText}>
                      <Text style={styles.boldText}>Serviço:</Text>{" "}
                      {obterServicoPorId(item.servicoId)?.descricao}
                    </Text>
                    <Text style={styles.appointmentText}>
                      <Text style={styles.boldText}>Data:</Text>{" "}
                      {item.dataInicioAgendamento.toLocaleString("pt-BR")}
                    </Text>
                  </View>
                )}
              />
            </View>
          ) : (
            <Text style={styles.noAppointmentsText}>
              Você ainda não tem agendamentos. Que tal agendar um serviço?
            </Text>
          )}

          {usuarioAppointments.length === 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate(NOMES.AGENDAMENTO)}
            >
              <Text style={styles.buttonText}>Agendar Serviço</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.welcomeText}>
          Por favor, faça login para continuar.
        </Text>
      )}
    </View>
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
    fontSize: 22,
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "600",
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
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  appointmentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  noAppointmentsText: {
    fontSize: 16,
    color: "#999",
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
