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
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { GreenButton } from "@/components/ui/GreenButton";
import { getPushToken } from "@/utils/getPushToken";

type ParentFormData = { email: string; password: string };
type HeroFormData = { parentEmail: string; name: string; password: string };
type PsychologistFormData = { email: string; password: string };

export default function LoginScreen() {
  const router = useRouter();
  const { loginAsParent, loginAsChild } = useAuth(); // <-- Implemente loginAsParent no contexto!
  const [loginType, setLoginType] = useState<
    "parent" | "child" | "psychologist"
  >("parent");

  // Formulários
  const {
    control: parentControl,
    handleSubmit: handleSubmitParent,
    formState: { errors: parentErrors, isSubmitting: isSubmittingParent },
  } = useForm<ParentFormData>();

  const {
    control: heroControl,
    handleSubmit: handleSubmitHero,
    formState: { errors: heroErrors, isSubmitting: isSubmittingHero },
  } = useForm<HeroFormData>();

  const {
    control: psychologistControl,
    handleSubmit: handleSubmitPsychologist,
    formState: {
      errors: psychologistErrors,
      isSubmitting: isSubmittingPsychologist,
    },
  } = useForm<PsychologistFormData>();

  // Handlers
  const onSubmitParent = async (data: ParentFormData) => {
    try {
      await loginAsParent(data.email, data.password);
      router.replace("/");
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      Alert.alert(
        "Erro ao entrar",
        error?.message || "E-mail ou senha inválidos"
      );
    }
  };

  const onSubmitHero = async (data: HeroFormData) => {
    try {
      const expoPushToken = await getPushToken();

      await loginAsChild(
        data.parentEmail,
        data.name,
        data.password,
        expoPushToken as string
      );
      router.replace("/");
    } catch {
      Alert.alert("Erro ao entrar", "Dados inválidos para login do herói");
    }
  };

  const onSubmitPsychologist = async (data: PsychologistFormData) => {
    try {
      await loginAsParent(data.email, data.password);
      router.replace("/");
    } catch {
      Alert.alert("Erro ao entrar", "E-mail ou senha inválidos para psicólogo");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bg-pattern.png")}
      style={StyleSheet.absoluteFillObject}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            alignSelf: "center",
            marginBottom: 24,
          }}
        />

        {/* Switch de login */}
        <View style={styles.switchWrapper}>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginType === "parent" && styles.switchButtonActive,
            ]}
            onPress={() => setLoginType("parent")}
          >
            <Text
              style={[
                styles.switchButtonText,
                loginType === "parent" && styles.switchButtonTextActive,
              ]}
            >
              Responsável
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginType === "child" && styles.switchButtonActive,
            ]}
            onPress={() => setLoginType("child")}
          >
            <Text
              style={[
                styles.switchButtonText,
                loginType === "child" && styles.switchButtonTextActive,
              ]}
            >
              Herói
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchButton,
              loginType === "psychologist" && styles.switchButtonActive,
            ]}
            onPress={() => setLoginType("psychologist")}
          >
            <Text
              style={[
                styles.switchButtonText,
                loginType === "psychologist" && styles.switchButtonTextActive,
              ]}
            >
              Psicólogo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulário do Responsável */}
        {loginType === "parent" && (
          <>
            <Controller
              name="email"
              control={parentControl}
              rules={{ required: "E-mail é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor={"#fff"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {parentErrors.email && (
              <Text style={styles.error}>{parentErrors.email.message}</Text>
            )}

            <Controller
              name="password"
              control={parentControl}
              rules={{ required: "Senha é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={"#fff"}
                  secureTextEntry
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {parentErrors.password && (
              <Text style={styles.error}>{parentErrors.password.message}</Text>
            )}

            <View
              style={{
                marginTop: 24,
              }}
            >
              <GreenButton
                disabled={isSubmittingParent}
                onPress={handleSubmitParent(onSubmitParent)}
              >
                {isSubmittingParent ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </GreenButton>
            </View>
          </>
        )}

        {/* Formulário do Herói */}
        {loginType === "child" && (
          <>
            <Controller
              name="parentEmail"
              control={heroControl}
              rules={{ required: "E-mail do responsável é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="E-mail do responsável"
                  placeholderTextColor={"#fff"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {heroErrors.parentEmail && (
              <Text style={styles.error}>{heroErrors.parentEmail.message}</Text>
            )}

            <Controller
              name="name"
              control={heroControl}
              rules={{ required: "Nome do herói é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nome do herói"
                  placeholderTextColor={"#fff"}
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {heroErrors.name && (
              <Text style={styles.error}>{heroErrors.name.message}</Text>
            )}

            <Controller
              name="password"
              control={heroControl}
              rules={{ required: "Senha é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={"#fff"}
                  secureTextEntry
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {heroErrors.password && (
              <Text style={styles.error}>{heroErrors.password.message}</Text>
            )}

            <View
              style={{
                marginTop: 24,
              }}
            >
              <GreenButton
                disabled={isSubmittingHero}
                onPress={handleSubmitHero(onSubmitHero)}
              >
                {isSubmittingHero ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </GreenButton>
            </View>
          </>
        )}

        {/* Formulário do Psicólogo */}
        {loginType === "psychologist" && (
          <>
            <Controller
              name="email"
              control={psychologistControl}
              rules={{ required: "E-mail é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="E-mail"
                  placeholderTextColor={"#fff"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {psychologistErrors.email && (
              <Text style={styles.error}>
                {psychologistErrors.email.message}
              </Text>
            )}

            <Controller
              name="password"
              control={psychologistControl}
              rules={{ required: "Senha é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={"#fff"}
                  secureTextEntry
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {psychologistErrors.password && (
              <Text style={styles.error}>
                {psychologistErrors.password.message}
              </Text>
            )}

            <View
              style={{
                marginTop: 24,
              }}
            >
              <GreenButton
                disabled={isSubmittingPsychologist}
                onPress={handleSubmitPsychologist(onSubmitPsychologist)}
              >
                {isSubmittingPsychologist ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </GreenButton>
            </View>
          </>
        )}

        {(loginType === "parent" || loginType === "psychologist") && (
          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#A6F3FF",
    backgroundColor: "#298B96",
    color: "#fff",
    fontFamily: "Afacad",
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
    fontFamily: "SupersonicRocketship",
  },
  linkContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Afacad",
  },
  error: {
    color: "#D32F2F",
    marginTop: 4,
    marginLeft: 4,
  },
  switchWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 2,
    backgroundColor: "#298B96",
    borderWidth: 1,
    borderColor: "#A6F3FF",
    borderRadius: 8,
  },
  switchButtonActive: {
    borderColor: "#1D3D47",
    backgroundColor: "#fff",
  },
  switchButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "SupersonicRocketship",
  },
  switchButtonTextActive: {
    color: "#1D3D47",
  },
});
