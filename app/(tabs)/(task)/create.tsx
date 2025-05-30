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
import {
  useCreateTask,
  useDeleteTaskMediaById,
  useTaskById,
  useUpdateTask,
} from "@/hooks/useTask";
import { TransparentButton } from "@/components/ui/TransparentButton";
import { GreenButton } from "@/components/ui/GreenButton";
import { Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import BackButton from "@/components/ui/BackButton";

type MediaAsset = {
  id?: number;
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
  const { mutate: deleteTaskMediaById, isPending: deleteTaskMediaByIdPending } =
    useDeleteTaskMediaById();
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [steps, setSteps] = useState("");
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<number[]>([]);

  const [status, setStatus] = useState<
    "pending" | "in_progress" | "completed" | "overdue"
  >("in_progress");
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    error: false,
  });
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [pointsError, setPointsError] = useState("");

  const [showDatePicker, setShowDatePicker] = useState<"date" | "time" | null>(
    null
  );

  useEffect(() => {
    if (existingTask && isEdit) {
      setDescription(existingTask.description);
      setPoints(existingTask.points.toString());
      setStatus(existingTask.status);
      setDueDate(new Date(existingTask.dueDate));
      setSteps(existingTask.steps.map((s) => s.instruction).join("\n"));
      setMedia(
        existingTask.media.map((m) => ({
          id: m.id,
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

  const pickMedia = async () => {
    if (media.length >= 5 || mediaLoading) return;

    try {
      setMediaLoading(true); // começa o loading

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
          {
            uri: asset.uri,
            type,
            fileName: asset.fileName ?? undefined,
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao carregar mídia:", error);
      showSnackbar("Erro ao carregar mídia", true);
    } finally {
      setMediaLoading(false);
    }
  };

  const removeMedia = (index: number, media: MediaAsset) => {
    if (isEdit && media.id) {
      setMediaToDelete((prev) => [...prev, media.id!]);
    }

    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
    if (!description.trim() || !points || !steps.trim()) {
      return showSnackbar("Preencha todos os campos obrigatórios.", true);
    }
    setPointsError("");

    const numericPoints = Number(points);

    if (!description.trim() || !points || !steps.trim()) {
      return showSnackbar("Preencha todos os campos obrigatórios.", true);
    }

    if (isNaN(numericPoints) || numericPoints < 0) {
      setPointsError("Os pontos devem ser um número positivo.");
      return;
    }
    const parsedSteps = steps
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((instruction, index) => ({ order: index + 1, instruction }));

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
        for (const id of mediaToDelete) {
          await deleteTaskMediaById(id);
        }
        await updateTask(
          {
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
          },
          {
            onSuccess: () => {
              showSnackbar("Tarefa atualizada com sucesso!");
              setMediaToDelete([]);
              setTimeout(() => router.push("/(tabs)"), 1500);
            },
          }
        );
      } else {
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
            onSuccess: () => {
              showSnackbar("Tarefa criada com sucesso!");
              setTimeout(() => router.push("/(tabs)"), 1500);
            },
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
      <BackButton onPress={() => router.back()}>Voltar</BackButton>

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
          style={[styles.input, pointsError && { borderColor: "#e74c3c" }]}
          keyboardType="numeric"
          value={points}
          onChangeText={setPoints}
          placeholder="Ex: 100"
          placeholderTextColor="#fff"
        />
        {pointsError ? (
          <Text style={{ color: "#e74c3c", marginTop: 4 }}>{pointsError}</Text>
        ) : null}

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
          {(["in_progress", "pending", "completed", "overdue"] as const).map(
            (value) => (
              <TouchableOpacity
                key={value}
                style={styles.radio}
                onPress={() => setStatus(value)}
              >
                <View style={styles.radioCircle}>
                  {status === value && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>
                  {
                    {
                      pending: "Pendente",
                      in_progress: "Em andamento",
                      completed: "Concluída",
                      overdue: "Atrasada",
                    }[value]
                  }
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {media.map((item, index) => (
          <View key={index} style={styles.mediaContainer}>
            <Text style={styles.imageLabel}>{item.type.toUpperCase()}</Text>
            <Text numberOfLines={1} style={{ flex: 1 }}>
              {item.fileName || item.uri}
            </Text>
            <TouchableOpacity onPress={() => removeMedia(index, item)}>
              <Text style={styles.removeText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}

        {media.length < 5 && (
          <TransparentButton onPress={pickMedia} disabled={mediaLoading}>
            {mediaLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>ADICIONAR MÍDIA ({media.length}/5)</>
            )}
          </TransparentButton>
        )}
      </View>

      <View style={styles.submitButton}>
        <GreenButton disabled={isCreating || isUpdating} onPress={onSubmit}>
          {isCreating || isUpdating || mediaLoading ? (
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
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 16,
    gap: 18,
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
