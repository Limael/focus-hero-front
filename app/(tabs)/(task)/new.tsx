import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TransparentButton } from "@/components/ui/TransparentButton";

export default function CreateTaskScreen() {
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [steps, setSteps] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");
  const [image, setImage] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CADASTRO DE TAREFA</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Descrição da tarefa</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Tomar café da manhã"
        />

        <Text style={styles.label}>Quantos pontos vale?</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
          placeholder="Ex: 100"
        />

        <Text style={styles.label}>Quais são os passos da tarefa?</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={steps}
          onChangeText={setSteps}
          placeholder="• Dobre a coberta;\n• Estique o lençol na cama."
        />

        <Text style={styles.label}>Status da tarefa</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radio}
            onPress={() => setStatus("pending")}
          >
            <View style={styles.radioCircle}>
              {status === "pending" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Não concluída</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radio}
            onPress={() => setStatus("completed")}
          >
            <View style={styles.radioCircle}>
              {status === "completed" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioLabel}>Concluída</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>PNG file</Text>
            <Text>{image.fileName || "Imagem selecionada"}</Text>
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.removeText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}

        <TransparentButton onPress={pickImage}>ADICIONE FOTO</TransparentButton>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>CRIAR TAREFA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#04272F",
    flexGrow: 1,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: "#07333C",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1DCBE299",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  radioLabel: {
    color: "#fff",
  },
  imageContainer: {
    backgroundColor: "#1DCBE2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeText: {
    fontSize: 18,
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#28E07C",
    padding: 16,
    borderRadius: 20,
    marginTop: 24,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
