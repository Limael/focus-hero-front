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
import { TransparentButton } from "@/components/ui/TransparentButton";
import { GreenButton } from "@/components/ui/GreenButton";
import { Snackbar } from "react-native-paper";
import { useCreateChild, useUpdateUser } from "@/hooks/useChildren";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/services/api";

type Gender = "male" | "female" | "other";

type HeroForm = {
  name: string;
  password: string;
  gender: Gender;
};

export default function CreateOrEditChildScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;

  const [heroes, setHeroes] = useState<HeroForm[]>([
    { name: "", password: "", gender: "male" },
  ]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    error: false,
  });

  const showSnackbar = (message: string, error = false) =>
    setSnackbar({ visible: true, message, error });

  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, visible: false }));

  const { mutateAsync: createChild } = useCreateChild();
  const { mutateAsync: updateChild } = useUpdateUser();

  useEffect(() => {
    const fetchChild = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const { data } = await api.get(`/users/${id}`);
          setHeroes([{ name: data.name, password: "", gender: data.gender }]);
        } catch (error: any) {
          showSnackbar("Erro ao carregar dados da criança", true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchChild();
  }, [id]);

  const handleChange = (
    index: number,
    field: keyof HeroForm,
    value: string
  ) => {
    const updated = [...heroes];
    updated[index][field] = value as any;
    setHeroes(updated);
  };

  const handleGenderChange = (index: number, gender: Gender) => {
    const updated = [...heroes];
    updated[index].gender = gender;
    setHeroes(updated);
  };

  const addHero = () => {
    if (heroes.length >= 5) return;
    setHeroes([...heroes, { name: "", password: "", gender: "male" }]);
  };

  const removeHero = (index: number) => {
    setHeroes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await updateChild({
          id: Number(id),
          data: {
            name: heroes[0].name,
            gender: heroes[0].gender,
            password: heroes[0].password || undefined,
          },
        });
        showSnackbar("Herói atualizado com sucesso!");
      } else {
        await Promise.all(heroes.map((hero) => createChild(hero)));
        showSnackbar("Heróis criados com sucesso!");
        setHeroes([{ name: "", password: "", gender: "male" }]);
      }

      setTimeout(() => {
        router.push("/(tabs)");
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error.message || "Erro desconhecido";
      showSnackbar(`Erro: ${message}`, true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DCBE2" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {heroes.map((hero, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.removeWrapper}>
            {!isEditMode && heroes.length > 1 && (
              <TouchableOpacity onPress={() => removeHero(index)}>
                <Text style={styles.removeText}>❌ Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.label}>Qual o nome do hero?</Text>
          <TextInput
            placeholderTextColor={"#fff"}
            style={styles.input}
            value={hero.name}
            onChangeText={(text) => handleChange(index, "name", text)}
            placeholder="Ex: Rafaela"
          />

          <Text style={styles.label}>
            {isEditMode ? "Nova senha (opcional)" : "Senha"}
          </Text>
          <TextInput
            placeholderTextColor={"#fff"}
            style={styles.input}
            value={hero.password}
            onChangeText={(text) => handleChange(index, "password", text)}
            secureTextEntry
            placeholder="********"
          />

          <Text style={styles.label}>Como se identifica?</Text>
          <View style={styles.radioGroup}>
            {(["male", "female", "other"] as Gender[]).map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.radioOption}
                onPress={() => handleGenderChange(index, g)}
              >
                <View style={styles.radioCircle}>
                  {hero.gender === g && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>
                  {g === "male"
                    ? "Masculino"
                    : g === "female"
                    ? "Feminino"
                    : "Outro"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={{ paddingHorizontal: 16, gap: 16, paddingTop: 16 }}>
        {!isEditMode && heroes.length < 5 && (
          <TransparentButton onPress={addHero}>
            ADICIONAR MAIS UM HERO
          </TransparentButton>
        )}
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
  removeWrapper: {
    alignItems: "flex-end",
  },
  removeText: {
    color: "#e74c3c",
    fontWeight: "bold",
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
