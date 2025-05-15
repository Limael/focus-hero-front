import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { Slot, useRouter } from "expo-router";
import RadialBackground from "@/components/RadialBackground";
import GearButton from "@/components/ui/GearButton";
import GemCounter from "@/components/ui/GemCounter";
import CharacterButton from "@/components/ui/CharacterButton";
import { useAuth } from "@/context/AuthContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function TabLayout() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDrawerMounted, setIsDrawerMounted] = useState(false);
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
            {user.role === "child" && <GemCounter amount={100} />}
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
                <Text style={styles.menuTitle}>Menu</Text>

                <TouchableOpacity
                  onPress={async () => {
                    await logout();
                    setMenuVisible(false);
                  }}
                >
                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
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
    width: 240,
    backgroundColor: "#fff",
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
});
