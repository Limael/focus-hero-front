import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCreateTask, useTaskById, useUpdateTask } from "@/hooks/useTask";
import { TransparentButton } from "@/components/ui/TransparentButton";
import { GreenButton } from "@/components/ui/GreenButton";
import { Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

type MediaAsset = {
  uri: string;
  type: "image" | "video";
  fileName?: string;
};

export default function CreateEditTaskScreen() {
  const router = useRouter();
  const { childId, id, mode } = useLocalSearchParams<{
    childId?: string;
    id?: string;
    mode?: "edit";
  }>();

  const isEdit = mode === "edit" && !!id;
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutateAsync: updateTask, isPending: isUpdating } = useUpdateTask();
  const { data: existingTask, isLoading: isLoadingTask } = useTaskById(id!);

  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [steps, setSteps] = useState("");
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
    "pending"
  );
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    error: false,
  });
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<"date" | "time" | null>(
    null
  );

  // Carrega dados da tarefa em modo de edição
  useEffect(() => {
    if (existingTask && isEdit) {
      setDescription(existingTask.description);
      setPoints(existingTask.points.toString());
      setStatus(existingTask.status);
      setDueDate(new Date(existingTask.dueDate));
      setSteps(existingTask.steps.map((s) => s.instruction).join("\n"));
      setMedia(
        existingTask.media.map((m) => ({
          uri: m.url,
          type: m.type,
          fileName: m.url.split("/").pop(),
        }))
      );
    }
  }, [existingTask]);

  const handleDateTimeChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate((prev) => {
        const updated = new Date(prev);
        if (showDatePicker === "date") {
          updated.setFullYear(selectedDate.getFullYear());
          updated.setMonth(selectedDate.getMonth());
          updated.setDate(selectedDate.getDate());
        } else if (showDatePicker === "time") {
          updated.setHours(selectedDate.getHours());
          updated.setMinutes(selectedDate.getMinutes());
        }
        return updated;
      });
    }
    setShowDatePicker(null);
  };

  const showSnackbar = (message: string, error = false) => {
    setSnackbar({ visible: true, message, error });
  };
  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, visible: false }));

  // Função para selecionar imagem/vídeo
  const pickMedia = async () => {
    if (media.length >= 5) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsMultipleSelection: false,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const type = asset.type === "video" ? "video" : "image";
      setMedia((prev) => [
        ...prev,
        { uri: asset.uri, type, fileName: asset.fileName ?? undefined },
      ]);
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para criar/editar tarefa
  const onSubmit = async () => {
    if (!description.trim() || !points || !steps.trim()) {
      return showSnackbar("Preencha todos os campos obrigatórios.", true);
    }

    const parsedSteps = steps
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((instruction, index) => ({ order: index + 1, instruction }));

    // Montando mídias novas (file://) e mídias existentes (URL remota)
    const newMedia = media.filter((m) => m.uri.startsWith("file://"));
    const mediaFiles = newMedia.map((item, idx) => ({
      uri: item.uri,
      name:
        item.fileName || `media${idx}.${item.type === "video" ? "mp4" : "jpg"}`,
      type: item.type === "video" ? "video/mp4" : "image/jpeg",
    }));

    const existingMedia = media
      .filter((m) => !m.uri.startsWith("file://"))
      .map((m) => ({ url: m.uri, type: m.type }));

    try {
      if (isEdit && id) {
        // --- EDITAR ---
        await updateTask({
          id: Number(id),
          data: {
            description,
            points: Number(points),
            childId: Number(childId),
            dueDate: dueDate.toISOString(),
            steps: parsedSteps,
            status,
            mediaFiles,
            media: existingMedia.length > 0 ? existingMedia : undefined,
          },
        });
        showSnackbar("Tarefa atualizada com sucesso!");
      } else {
        // --- CRIAR ---
        createTask(
          {
            description,
            points: Number(points),
            childId: Number(childId),
            dueDate: dueDate.toISOString(),
            steps: parsedSteps,
            mediaFiles,
          },
          {
            onSuccess: () => showSnackbar("Tarefa criada com sucesso!"),
            onError: (err: any) => {
              const message =
                err?.response?.data?.message ||
                err?.message ||
                "Erro desconhecido";
              showSnackbar(`Erro: ${message}`, true);
            },
          }
        );
      }
      setTimeout(() => router.push("/(tabs)"), 1500);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || "Erro desconhecido";
      showSnackbar(`Erro: ${msg}`, true);
    }
  };

  if (isEdit && isLoadingTask) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1DCBE2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEdit ? "EDITAR TAREFA" : "CADASTRO DE TAREFA"}
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Descrição da tarefa*</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Ex: Tomar café da manhã"
          placeholderTextColor="#fff"
        />

        <Text style={styles.label}>Quantos pontos vale?*</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
          placeholder="Ex: 100"
          placeholderTextColor="#fff"
        />

        <Text style={styles.label}>Quais são os passos da tarefa?*</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={steps}
          onChangeText={setSteps}
          placeholder={`Ex:\nAcordar\nEscovar os dentes\nTomar café`}
          placeholderTextColor="#fff"
        />

        <Text style={styles.label}>Data e hora da tarefa</Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TransparentButton onPress={() => setShowDatePicker("date")}>
            {dueDate.toLocaleDateString("pt-BR")}
          </TransparentButton>
          <TransparentButton onPress={() => setShowDatePicker("time")}>
            {dueDate.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </TransparentButton>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode={showDatePicker}
            display="default"
            onChange={handleDateTimeChange}
            minimumDate={new Date()}
            is24Hour
          />
        )}

        <Text style={styles.label}>Status da tarefa</Text>
        <View style={styles.radioGroup}>
          {["pending", "completed"].map((value) => (
            <TouchableOpacity
              key={value}
              style={styles.radio}
              onPress={() => setStatus(value as any)}
            >
              <View style={styles.radioCircle}>
                {status === value && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>
                {value === "pending" ? "Não concluída" : "Concluída"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {media.map((item, index) => (
          <View key={index} style={styles.mediaContainer}>
            <Text style={styles.imageLabel}>{item.type.toUpperCase()}</Text>
            <Text numberOfLines={1} style={{ flex: 1 }}>
              {item.fileName || item.uri}
            </Text>
            <TouchableOpacity onPress={() => removeMedia(index)}>
              <Text style={styles.removeText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

        {media.length < 5 && (
          <TransparentButton onPress={pickMedia}>
            ADICIONAR MÍDIA ({media.length}/5)
          </TransparentButton>
        )}
      </View>

      <View style={styles.submitButton}>
        <GreenButton disabled={isCreating || isUpdating} onPress={onSubmit}>
          {isCreating || isUpdating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>
              {isEdit ? "SALVAR ALTERAÇÕES" : "CRIAR TAREFA"}
            </Text>
          )}
        </GreenButton>
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={hideSnackbar}
        duration={2000}
        style={{
          backgroundColor: snackbar.error ? "#e74c3c" : "#288F4D",
          flex: 1,
        }}
      >
        {snackbar.message}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: "#04272F", flexGrow: 1 },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    borderWidth: 2,
    borderColor: "#518692",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    backgroundColor: "#0A3B46",
  },
  label: { color: "#fff", fontWeight: "bold" },
  input: {
    borderWidth: 2,
    borderColor: "#A6F3FF",
    backgroundColor: "#298B96",
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
  mediaContainer: {
    backgroundColor: "#1DCBE2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    padding: 16,
    marginTop: 24,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
