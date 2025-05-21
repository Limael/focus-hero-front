import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RewardShield } from "@/components/ui/RewardShield";
import GemSVG from "@/components/ui/GemSVG";
import { GreenButton } from "@/components/ui/GreenButton";
import {
  useSubmitTask,
  useTaskById,
  useUpdateTaskStatus,
} from "@/hooks/useTask";
import { useAuth } from "@/context/AuthContext";
import { TransparentButton } from "@/components/ui/TransparentButton";

const { width, height } = Dimensions.get("window");

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendente";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluída";
    default:
      return status;
  }
};

function formatElapsed(seconds: number) {
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const router = useRouter();
  const { data: task, isLoading } = useTaskById(id);
  const { mutate: updateTaskStatus } = useUpdateTaskStatus();
  const [isTiming, setIsTiming] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [mediaFiles, setMediaFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [isMediaLoading, setIsMediaLoading] = useState(false);
  const totalElapsed = (task?.submission?.totalTime ?? 0) + elapsedSeconds;

  const { mutate: submitTask, isPending: isSubmitting } = useSubmitTask();

  const [zoomMedia, setZoomMedia] = useState<null | {
    type: string;
    url: string;
  }>(null);

  const [finishModalVisible, setFinishModalVisible] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTiming) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTiming]);

  async function handleAddMedia() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setMediaFiles([
        {
          uri: asset.uri,
          name: asset.fileName || asset.uri.split("/").pop() || "media.jpg",
          type: asset.type === "video" ? "video/mp4" : "image/jpeg",
        },
      ]);
    }
  }

  async function handleAddMediaModal() {
    setIsMediaLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      setMediaFiles([
        {
          uri: asset.uri,
          name: asset.fileName || asset.uri.split("/").pop() || "media.jpg",
          type: asset.type === "video" ? "video/mp4" : "image/jpeg",
        },
      ]);
    }
    setTimeout(() => setIsMediaLoading(false), 400);
  }

  function finishTask(finalize = false) {
    setIsTiming(false);
    submitTask(
      {
        taskId: Number(task?.id),
        totalTime: elapsedSeconds,
        mediaFiles,
        finalize,
      } as any,
      {
        onSuccess: () => {
          setElapsedSeconds(0);

          if (finalize) {
            updateTaskStatus({ id: Number(task?.id), status: "pending" });
            setMediaFiles([]);
            setFinishModalVisible(false);
          } else {
            setFinishModalVisible(false);
          }
        },
        onError: (err) => {
          console.error("Error submitting task:", err);
        },
      }
    );
  }

  if (isLoading || !task) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#1DCBE2" size="large" />
      </View>
    );
  }

  const submission = task.submission;
  const canInteract = user?.role === "child" && task.status === "in_progress";

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        visible={!!zoomMedia}
        animationType="fade"
        transparent
        onRequestClose={() => setZoomMedia(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setZoomMedia(null)}
        >
          {zoomMedia &&
            (zoomMedia.type === "video" ? (
              <Video
                source={{ uri: zoomMedia.url }}
                style={styles.modalMedia}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Image
                source={{ uri: zoomMedia.url }}
                style={styles.modalMedia}
                resizeMode="contain"
              />
            ))}
        </Pressable>
      </Modal>

      <Modal
        visible={finishModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFinishModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setFinishModalVisible(false)}
        >
          <View style={styles.finishModalContent}>
            <Text style={styles.finishModalTitle}>
              Para finalizar, selecione uma foto ou vídeo da tarefa!
            </Text>
            <View style={{ alignItems: "center", marginVertical: 18 }}>
              {mediaFiles.length > 0 ? (
                mediaFiles[0].type.startsWith("video") ? (
                  <Video
                    source={{ uri: mediaFiles[0].uri }}
                    style={{
                      width: 140,
                      height: 90,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                  />
                ) : (
                  <Image
                    source={{ uri: mediaFiles[0].uri }}
                    style={{
                      width: 140,
                      height: 90,
                      borderRadius: 8,
                      marginBottom: 12,
                    }}
                    resizeMode="cover"
                  />
                )
              ) : (
                <View
                  style={{
                    width: 140,
                    height: 90,
                    borderRadius: 8,
                    backgroundColor: "#234",
                    marginBottom: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#A6F3FF", fontSize: 13 }}>
                    Nenhuma mídia selecionada
                  </Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <GreenButton
                onPress={handleAddMediaModal}
                disabled={isMediaLoading || isSubmitting}
              >
                {isMediaLoading
                  ? "Processando..."
                  : mediaFiles.length > 0
                  ? "Trocar mídia"
                  : "Selecionar mídia"}
              </GreenButton>
              {mediaFiles.length > 0 && !isMediaLoading && (
                <GreenButton
                  disabled={isSubmitting}
                  onPress={() => finishTask(true)}
                >
                  {isSubmitting ? "Enviando..." : "Finalizar"}
                </GreenButton>
              )}
              {isMediaLoading && (
                <View style={{ marginLeft: 8, justifyContent: "center" }}>
                  <ActivityIndicator color="#A6F3FF" size="small" />
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.wrapper}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 96 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentHeader}>
              <Text style={styles.title}>{task.description}</Text>
              <Text style={styles.dueDate}>
                Prazo: {formatDate(task.dueDate)}
              </Text>
            </View>

            <View style={styles.card}>
              <FlatList
                horizontal
                data={task.media}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  item.type === "image" ? (
                    <Image
                      source={{ uri: item.url }}
                      style={styles.mediaItem}
                    />
                  ) : (
                    <Video
                      source={{ uri: item.url }}
                      style={styles.mediaItem}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                    />
                  )
                }
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 64}
                decelerationRate="fast"
                contentContainerStyle={styles.mediaContainer}
              />

              <View style={styles.taskHeader}>
                <Text style={styles.subTitle}>Como fazer...</Text>
                <View style={styles.rewardWrapper}>
                  <RewardShield
                    text={`+${task.points}`}
                    Icon={<GemSVG width={70} height={86} />}
                    gradientStart="#F8C98E"
                    gradientEnd="#C98B44"
                  />
                </View>
              </View>

              <Text style={styles.steps}>
                {task.steps.map((step) => `\u2022 ${step.instruction}\n`)}
              </Text>

              {submission && (
                <View style={styles.submissionsWrapper}>
                  <Text style={styles.historyTitle}>Entrega da tarefa:</Text>
                  <View style={styles.submissionCard}>
                    <Text style={styles.submissionText}>
                      Tempo: {formatElapsed(submission.totalTime)} | Status:{" "}
                      {formatStatus(task.status)}
                    </Text>
                    <View style={styles.submissionMediaRow}>
                      {submission.media.map((media, mIdx) => (
                        <Pressable
                          key={mIdx}
                          onPress={() => setZoomMedia(media)}
                          style={{ alignItems: "center" }}
                        >
                          {media.type === "video" ? (
                            <Video
                              source={{ uri: media.url }}
                              style={styles.submissionMedia}
                              resizeMode={ResizeMode.CONTAIN}
                            />
                          ) : (
                            <Image
                              source={{ uri: media.url }}
                              style={styles.submissionMedia}
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          {canInteract && submission && (
            <>
              <View style={styles.previewMediaRow}>
                {mediaFiles.map((file, idx) =>
                  file.type.startsWith("video") ? (
                    <Video
                      key={idx}
                      source={{ uri: file.uri }}
                      style={styles.previewMedia}
                      resizeMode={ResizeMode.CONTAIN}
                    />
                  ) : (
                    <Image
                      key={idx}
                      source={{ uri: file.uri }}
                      style={styles.previewMedia}
                    />
                  )
                )}
              </View>
              {task.status !== "completed" && (
                <View style={{ marginBottom: 12 }}>
                  <TransparentButton
                    onPress={() => setFinishModalVisible(true)}
                  >
                    finalizar tarefa
                  </TransparentButton>
                </View>
              )}
            </>
          )}

          {canInteract && !isTiming ? (
            <GreenButton
              onPress={() => {
                setIsTiming(true);
                setElapsedSeconds(0);
              }}
            >
              {submission ? "Continuar tarefa" : "Iniciar tarefa"}
            </GreenButton>
          ) : canInteract && isTiming ? (
            <GreenButton
              onPress={() => {
                finishTask(false);
              }}
            >
              {formatElapsed(totalElapsed)} - Pausar Tarefa
            </GreenButton>
          ) : user?.role === "parent" ? (
            <>
              {task.status === "pending" && (
                <View style={{ marginBottom: 12 }}>
                  <GreenButton
                    onPress={() =>
                      updateTaskStatus({
                        id: Number(task.id),
                        status: "completed",
                      })
                    }
                  >
                    Aceitar tarefa
                  </GreenButton>
                </View>
              )}
              <GreenButton
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(task)/create",
                    params: { id: task.id.toString(), mode: "edit" },
                  })
                }
              >
                EDITAR TAREFA
              </GreenButton>
            </>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  wrapper: { flex: 1, justifyContent: "space-between" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Supersonic Rocketship",
    color: "#fff",
    flex: 1,
  },
  dueDate: { fontSize: 16, color: "#fff", marginLeft: 12 },
  card: {
    padding: 16,
    backgroundColor: "#0A3B46",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#518692",
  },
  mediaContainer: {
    gap: 12,
    marginBottom: 12,
  },
  mediaItem: {
    width: width - 94,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A6F3FF",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rewardWrapper: { marginTop: -16 },
  subTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  steps: { width: "100%", color: "#fff", marginTop: -8, lineHeight: 22 },
  expectedTime: { color: "#fff", marginTop: 8, fontSize: 16 },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.93)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalMedia: {
    width: width * 0.92,
    height: height * 0.65,
    borderRadius: 12,
  },
  finishModalContent: {
    backgroundColor: "#0A3B46",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
  },
  finishModalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  previewMediaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  previewMedia: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A6F3FF",
    marginRight: 4,
  },
  submissionsWrapper: {
    marginTop: 24,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  submissionCard: {
    backgroundColor: "#19404A",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  submissionText: {
    color: "#A6F3FF",
    marginBottom: 4,
    fontSize: 14,
  },
  submissionMediaRow: {
    flexDirection: "row",
    gap: 6,
  },
  submissionMedia: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A6F3FF",
    marginRight: 2,
  },
});
