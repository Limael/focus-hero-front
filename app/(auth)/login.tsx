import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext"; // 👈 importa aqui
import { api } from "@/services/api";
import axios from "axios";

type FormData = { email: string; password: string };

export default function LoginScreen() {
  const router = useRouter();
  const { loginAsParent } = useAuth(); // 👈 usa o AuthContext


  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await loginAsParent(data.email, data.password);
      router.replace("/");
    } catch (err: any) {
      console.error("Erro ao logar:", err);
      Alert.alert("Erro ao entrar", "E-mail ou senha inválidos");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <Text style={styles.title}>Bem-vindo de volta!</Text>

      <Controller
        name="email"
        control={control}
        rules={{ required: "E-mail é obrigatório" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        name="password"
        control={control}
        rules={{ required: "Senha é obrigatória" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Senha"
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#1D3D47",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1D3D47",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#1A1CED",
    fontSize: 14,
  },
  error: {
    color: "#D32F2F",
    marginTop: 4,
    marginLeft: 4,
  },
});
