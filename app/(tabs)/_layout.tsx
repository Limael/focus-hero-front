import React, { useEffect, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  ImageBackground,
  TextInput,
} from "react-native";
import { Slot, useRouter } from "expo-router";
import RadialBackground from "@/components/RadialBackground";
import GearButton from "@/components/ui/GearButton";
import GemCounter from "@/components/ui/GemCounter";
import CharacterButton from "@/components/ui/CharacterButton";
import { useAuth } from "@/context/AuthContext";
import { TransparentButton } from "@/components/ui/TransparentButton";
import { RoleCard } from "@/components/ui/RoleCard";
import GameMasterSVG from "@/components/ui/GameMasterSVG";
import TrashSVG from "@/components/ui/TrashSVG";
import WizardSVG from "@/components/ui/WizardSVG";
import { useLinkPsychologist } from "@/hooks/usePsychologist";
import { RadioButton } from "@/components/ui/RadioButton";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function TabLayout() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDrawerMounted, setIsDrawerMounted] = useState(false);
  const [associationKey, setAssociationKey] = useState("");
  const {
    mutate: linkPsychologist,
    isPending,
    isSuccess,
    error,
  } = useLinkPsychologist();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  useEffect(() => {
    if (!loading && !user) {
      router.replace("../(auth)/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (menuVisible) {
      setIsDrawerMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsDrawerMounted(false);
      });
    }
  }, [menuVisible]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RadialBackground>
        <ImageBackground
          source={require("@/assets/images/bg-pattern.png")}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.topBar}>
            <GearButton onPress={() => setMenuVisible(true)} />
            {user.role === "child" && <GemCounter amount={user?.points} />}
            <CharacterButton />
          </View>

          <Slot />

          {isDrawerMounted && (
            <Pressable
              onPress={() => setMenuVisible(false)}
              style={styles.overlay}
            >
              <Animated.View
                style={[
                  styles.drawer,
                  {
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.userInfoBox}>
                    <Text style={styles.label}>Nome</Text>
                    <View style={styles.infoInput}>
                      <Text style={styles.infoText}>{user.name}</Text>
                    </View>
                    {user.role === "parent" ||
                      (user.role === "psychologist" && (
                        <>
                          <Text style={styles.label}>E-mail</Text>
                          <View style={styles.infoInput}>
                            <Text style={styles.infoText}>{user.email}</Text>
                          </View>
                        </>
                      ))}
                  </View>
                  {user.role !== "psychologist" && (
                    <RoleCard
                      title="MESTRE DE JOGO"
                      subtitle={user.parent?.name}
                      icon={<GameMasterSVG width={36} height={36} />}
                      cardColor="#27965A"
                      borderColor="#51f5b6"
                      iconBgColor="#227e4d"
                      iconBorderColor="#A7F2CB"
                      rightAction={<RadioButton checked />}
                    />
                  )}

                  {user.role === "psychologist" ? (
                    <View style={{ marginBottom: 12 }}>
                      <RoleCard
                        title="Minha chave de associação"
                        subtitle={user.associationKey}
                        icon={<WizardSVG width={36} height={36} />}
                        cardColor="#0A3440"
                        borderColor="#27828F"
                        iconBgColor="#12343B"
                        iconBorderColor="#27828F"
                        titleColor="#fff"
                        rightAction={
                          <TouchableOpacity
                            onPress={async () => {
                              await Clipboard.setStringAsync(
                                user.associationKey ?? ""
                              );
                              setSuccessMsg("Código copiado!");
                              setTimeout(() => setSuccessMsg(null), 1500);
                            }}
                            style={{
                              padding: 8,
                              marginLeft: 4,
                              backgroundColor: "#27828F",
                              borderRadius: 5,
                            }}
                          >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                              Copiar
                            </Text>
                          </TouchableOpacity>
                        }
                      />
                      {successMsg && (
                        <Text style={{ color: "#51f5b6", marginTop: 8 }}>
                          {successMsg}
                        </Text>
                      )}
                    </View>
                  ) : !user?.psychologist ? (
                    <View style={{ marginBottom: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 8,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "#A6F3FF",
                              fontSize: 14,
                              marginBottom: 2,
                              marginLeft: 2,
                            }}
                          >
                            Código do psicólogo
                          </Text>
                          <View
                            style={{
                              backgroundColor: "#18485A",
                              borderRadius: 7,
                              borderWidth: 1,
                              borderColor: "#27828F",
                              flexDirection: "row",
                              alignItems: "center",
                              paddingLeft: 10,
                            }}
                          >
                            <TextInput
                              placeholder="Ex: 68b0c1b0-xxxx-xxxx"
                              placeholderTextColor="#95C8DB"
                              style={{
                                color: "#fff",
                                paddingVertical: 8,
                                fontSize: 16,
                                flex: 1,
                              }}
                              value={associationKey}
                              onChangeText={setAssociationKey}
                              editable={!isPending}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                linkPsychologist(
                                  { associationKey },
                                  {
                                    onSuccess: () => {
                                      setSuccessMsg("Vinculado com sucesso!");
                                    },
                                  }
                                );
                              }}
                              disabled={isPending || !associationKey}
                              style={{
                                padding: 8,
                                marginLeft: 4,
                                backgroundColor: "#27828F",
                                borderRadius: 5,
                                opacity: isPending || !associationKey ? 0.7 : 1,
                              }}
                            >
                              <Text
                                style={{ color: "#fff", fontWeight: "600" }}
                              >
                                {isPending ? "Vinculando..." : "Vincular"}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      {error && (
                        <Text style={{ color: "#C85C40", marginTop: 8 }}>
                          {error instanceof Error
                            ? error.message
                            : "Erro ao vincular"}
                        </Text>
                      )}
                      {isSuccess && successMsg && (
                        <Text style={{ color: "#51f5b6", marginTop: 8 }}>
                          {successMsg}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <RoleCard
                      title={
                        user?.psychologist?.name ?? "Psicólogo não encontrado"
                      }
                      icon={<WizardSVG width={36} height={36} />}
                      cardColor="#0A3440"
                      borderColor="#27828F"
                      iconBgColor="#12343B"
                      iconBorderColor="#27828F"
                      titleColor="#fff"
                      rightAction={
                        <TouchableOpacity onPress={() => alert("Excluir!")}>
                          <TrashSVG width={22} height={22} />
                        </TouchableOpacity>
                      }
                    />
                  )}

                  <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <TransparentButton
                      onPress={async () => {
                        await logout();
                        setMenuVisible(false);
                      }}
                    >
                      Sair
                    </TransparentButton>
                  </View>
                </View>
              </Animated.View>
            </Pressable>
          )}
        </ImageBackground>
      </RadialBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    backgroundColor: "#52D3E8",
    borderColor: "#ffffffcc",
    borderBottomWidth: 1,
    padding: 8,
    paddingTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#00000066",
    flexDirection: "row",
  },
  drawer: {
    width: 330,
    backgroundColor: "#0A3B46",
    borderWidth: 1,
    borderColor: "#518692",
    height: "100%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 99,
    marginTop: 36,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    paddingBottom: 44,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    color: "#C85C40",
    fontWeight: "600",
  },
  userInfoBox: {
    borderWidth: 1,
    borderColor: "#407980",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    backgroundColor: "#12343b",
  },
  label: {
    fontSize: 13,
    color: "#fff",
    marginBottom: 4,
    marginTop: 8,
  },
  infoInput: {
    backgroundColor: "#319298",
    borderRadius: 9,
    padding: 12,
    borderWidth: 2,
    borderColor: "#A6F3FF",
    marginBottom: 6,
  },
  infoText: {
    color: "#fff",
    fontSize: 15,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 6,
  },
  radioBubble: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 4,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleChecked: {
    backgroundColor: "#fff",
  },
  radioLabel: {
    color: "#fff",
    fontSize: 13,
  },
});
