import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TransparentButton } from "@/components/ui/TransparentButton";
import { GreenButton } from "@/components/ui/GreenButton";
import { Snackbar } from "react-native-paper";
import {
  useCreateReward,
  useRewardById,
  useUpdateReward,
} from "@/hooks/useRewards";
import { useChildren } from "@/hooks/useChildren";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RewardStatus } from "@/types/RewardDto";
import BackButton from "@/components/ui/BackButton";

type RewardForm = {
  description: string;
  requiredPoints: string;
  status: RewardStatus;
  childId?: number;
};

const initialForm: RewardForm = {
  description: "",
  requiredPoints: "",
  status: "available",
  childId: undefined,
};

export default function CreateOrEditRewardScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const [form, setForm] = useState<RewardForm>(initialForm);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    error: false,
  });

  const showSnackbar = (message: string, error = false) =>
    setSnackbar({ visible: true, message, error });

  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, visible: false }));

  const { data: children = [], isLoading: isLoadingChildren } = useChildren();
  const { mutateAsync: createReward } = useCreateReward();
  const { mutateAsync: updateReward } = useUpdateReward();
  const { data: existingReward, isLoading: isLoadingReward } = useRewardById(
    id,
    { enabled: isEditMode }
  );

  // Preenche o form em modo edição
  useEffect(() => {
    if (isEditMode && existingReward) {
      setForm({
        description: existingReward.description || "",
        requiredPoints: String(existingReward.requiredPoints || ""),
        status: existingReward.status || "available",
        childId: existingReward.childId,
      });
    }
  }, [isEditMode, existingReward]);

  // Handler dos campos
  const handleChange = (
    field: keyof RewardForm,
    value: string | number | undefined
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Envio
  const handleSubmit = async () => {
    if (
      !form.description ||
      !form.requiredPoints ||
      (!isEditMode && !form.childId)
    ) {
      showSnackbar("Preencha todos os campos obrigatórios.", true);
      return;
    }

    try {
      if (isEditMode && id) {
        await updateReward({
          id: Number(id),
          data: {
            description: form.description,
            requiredPoints: Number(form.requiredPoints),
            status: form.status,
          },
        });
        showSnackbar("Prêmio atualizado com sucesso!");
      } else {
        await createReward({
          description: form.description,
          requiredPoints: Number(form.requiredPoints),
          childId: form.childId!,
          status: form.status,
        });
        showSnackbar("Prêmio criado com sucesso!");
        setForm(initialForm);
      }

      setTimeout(() => {
        router.replace("..");
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Erro desconhecido";
      showSnackbar(`Erro: ${message}`, true);
    }
  };

  if (isLoadingReward || isLoadingChildren) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DCBE2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton onPress={() => router.back()}>Voltar</BackButton>

      <View style={styles.card}>
        <Text style={styles.label}>Descrição do prêmio*</Text>
        <TextInput
          placeholderTextColor={"#fff"}
          style={styles.input}
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholder="Ex: Passeio no parque"
        />

        <Text style={styles.label}>Pontos necessários*</Text>
        <TextInput
          placeholderTextColor={"#fff"}
          style={styles.input}
          value={form.requiredPoints}
          keyboardType="numeric"
          onChangeText={(text) =>
            handleChange("requiredPoints", text.replace(/[^0-9]/g, ""))
          }
          placeholder="Ex: 100"
        />

        {/* Só mostra o select de criança no modo CREATE */}
        {!isEditMode && (
          <>
            <Text style={styles.label}>Para qual criança?</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.childId}
                onValueChange={(itemValue) =>
                  handleChange(
                    "childId",
                    itemValue === 0 ? undefined : itemValue
                  )
                }
                style={styles.picker}
                dropdownIconColor="#1DCBE2"
              >
                <Picker.Item
                  label="Selecione uma criança"
                  value={0}
                  key="default"
                />
                {children.map((relation) => (
                  <Picker.Item
                    label={relation.child.name}
                    value={relation.child.id}
                    key={relation.child.id}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Text style={styles.label}>Status</Text>
        <View style={styles.radioGroup}>
          {(["available", "pending", "redeemed"] as RewardStatus[]).map(
            (status) => (
              <TouchableOpacity
                key={status}
                style={styles.radioOption}
                onPress={() => handleChange("status", status)}
              >
                <View style={styles.radioCircle}>
                  {form.status === status && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>
                  {status === "available"
                    ? "Disponível"
                    : status === "pending"
                    ? "Pendente"
                    : "Resgatado"}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, gap: 16, paddingTop: 16 }}>
        <GreenButton onPress={handleSubmit}>
          {isEditMode ? "SALVAR" : "CRIAR"}
        </GreenButton>
      </View>
      <View style={styles.Snackbarcontainer}>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={hideSnackbar}
          duration={3000}
          style={{
            backgroundColor: snackbar.error ? "#e74c3c" : "#288F4D",
            margin: 16,
          }}
        >
          {snackbar.message}
        </Snackbar>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#0A3B46",
    borderWidth: 2,
    borderColor: "#518692",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 2,
    borderColor: "#A6F3FF",
    backgroundColor: "#298B96",
    padding: 12,
    borderRadius: 12,
    color: "#fff",
  },
  pickerWrapper: {
    backgroundColor: "#155F6D",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    width: "100%",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
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
  Snackbarcontainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
