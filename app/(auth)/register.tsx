import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegister } from "@/hooks/useRegister";
import { GreenButton } from "@/components/ui/GreenButton";
import { RoleCard } from "@/components/ui/RoleCard";
import GameMasterSVG from "@/components/ui/GameMasterSVG";
import WizardSVG from "@/components/ui/WizardSVG";
import { RadioButton } from "@/components/ui/RadioButton";

const GENDERS = [
  { label: "Homem", value: "male" },
  { label: "Mulher", value: "female" },
  { label: "Outro", value: "other" },
];

type Role = "parent" | "psychologist";
type Gender = "male" | "female" | "other";

type FormData = {
  name: string;
  email: string;
  password: string;
  gender: Gender;
};

const schema = Yup.object({
  name: Yup.string().required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .required("Senha é obrigatória"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"])
    .required("Gênero obrigatório"),
});

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("parent");
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { gender: "male" },
  });

  const onSubmit = (data: FormData) => {
    register(
      { ...data, role },
      {
        onSuccess: () => {
          alert("Cadastro realizado! Faça login.");
          router.replace("/login");
        },
        onError: (error: any) => {
          alert(
            error.response?.data?.message ||
              error.message ||
              "Erro ao cadastrar"
          );
        },
      }
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg-pattern.png")}
      style={StyleSheet.absoluteFillObject}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>BOAS VINDAS!</Text>
          <Text style={styles.subheading}>PODEMOS NOS CONHECER MELHOR?</Text>

          <View style={styles.formBox}>
            {/* Nome */}
            <Text style={styles.label}>Qual seu nome?</Text>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Insira aqui"
                  placeholderTextColor="#A6F3FF"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}

            {/* Email */}
            <Text style={styles.label}>Qual seu e-mail?</Text>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Ex: mago@email.com"
                  placeholderTextColor="#A6F3FF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            {/* Senha */}
            <Text style={styles.label}>Senha</Text>
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Ex: mago@email.com"
                  placeholderTextColor="#A6F3FF"
                  secureTextEntry
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}

            {/* Gênero */}
            <Text style={styles.label}>Como se identifica?</Text>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={styles.radioGroup}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => onChange(g.value)}
                      style={styles.radioItem}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          value === g.value && styles.radioChecked,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{g.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.gender && (
              <Text style={styles.error}>{errors.gender.message}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setRole("parent")}>
            <RoleCard
              title="MESTRE DE JOGO"
              subtitle={"Pais ou responsável legal"}
              icon={<GameMasterSVG width={36} height={36} />}
              cardColor={role === "parent" ? "#27965A" : "#0A3B46"}
              borderColor={role === "parent" ? "#51f5b6" : "#518692"}
              iconBgColor={role === "parent" ? "#227e4d" : "#298B96"}
              iconBorderColor={role === "parent" ? "#A7F2CB" : "#A6F3FF"}
              rightAction={
                <RadioButton
                  checked={role === "parent"}
                  onPress={() => setRole("parent")}
                />
              }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRole("psychologist")}>
            <RoleCard
              title="O MAGO"
              subtitle={"Profissional psicólogo"}
              icon={<WizardSVG width={36} height={36} />}
              cardColor={role === "psychologist" ? "#27965A" : "#0A3B46"}
              borderColor={role === "psychologist" ? "#51f5b6" : "#518692"}
              iconBgColor={role === "psychologist" ? "#227e4d" : "#298B96"}
              iconBorderColor={role === "psychologist" ? "#A7F2CB" : "#A6F3FF"}
              rightAction={
                <RadioButton
                  checked={role === "psychologist"}
                  onPress={() => setRole("psychologist")}
                />
              }
            />
          </TouchableOpacity>
          {/* Papel: cards grandes */}

          <View
            style={{
              marginTop: 16,
            }}
          >
            <GreenButton onPress={handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>ENVIAR</Text>
              )}
            </GreenButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// ---- ESTILOS ----

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  backButton: { marginBottom: 12 },
  backButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  heading: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 2,
  },
  subheading: {
    color: "#A6F3FF",
    fontSize: 16,
    marginBottom: 20,
  },
  formBox: {
    backgroundColor: "#0A3B46",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#4EDDE5",
    padding: 18,
    marginBottom: 22,
  },
  label: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 3,
    fontWeight: "700",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#165A6D",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#49E1FA",
    color: "#fff",
    fontSize: 16,
    padding: 10,
    marginBottom: 5,
  },
  error: { color: "#FD6775", fontSize: 13, marginBottom: 2, marginLeft: 4 },
  radioGroup: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 8,
    gap: 12,
  },
  radioItem: { flexDirection: "row", alignItems: "center", marginRight: 8 },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#49E1FA",
    marginRight: 5,
    backgroundColor: "#18556B",
  },
  radioChecked: {
    backgroundColor: "#49E1FA",
    borderColor: "#fff",
  },
  radioLabel: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  roleCard: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#155F73",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#27828F",
    marginBottom: 13,
  },
  roleCardActive: {
    borderColor: "#34E47C",
    backgroundColor: "#22C581",
  },
  roleTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 4,
  },
  roleSubtitle: {
    color: "#A6F3FF",
    fontSize: 14,
    fontWeight: "400",
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#34E47C",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#34E47C",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1,
  },
});
