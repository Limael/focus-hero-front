import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useTasksByChild } from "@/hooks/useTask";
import { useRouter } from "expo-router";
import { RewardTaskCard } from "../ui/RewardTaskCard";
import { TransparentButton } from "../ui/TransparentButton";
import ArrowDownSVG from "../ui/ArrowDownSVG";
import CharacterButton from "../ui/CharacterButton";
import { ChildUser } from "@/types/user";
import ThreeDotsSVG from "../ui/ThreeDotsSVG";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export function ParentTaskAccordion({ child }: { child: ChildUser }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { data: tasks = [], isLoading } = useTasksByChild(child.id);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = !expanded;
    setExpanded(next);

    Animated.timing(fadeAnim, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={toggle} style={styles.childHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <CharacterButton
            backgroundColor={child.gender === "female" ? "#962965" : "#298B96"}
          />
          <Text style={styles.childName}>{child.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/(tabs)/(child)/create-edit-child",
                params: { id: child.id },
              });
            }}
          >
            <ThreeDotsSVG />
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <ArrowDownSVG />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <Animated.View style={[styles.taskList, { opacity: fadeAnim }]}>
          {isLoading ? (
            <ActivityIndicator color="#1DCBE2" size="small" />
          ) : tasks.length > 0 ? (
            <>
              {tasks.map((task) => (
                <RewardTaskCard
                  key={task.id}
                  reward={task.points}
                  isTask
                  title={task.description}
                  showReward={false}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(task)/[id]",
                      params: { id: task.id },
                    })
                  }
                />
              ))}
              <TransparentButton
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(task)/create",
                    params: { childId: child.id },
                  })
                }
              >
                Criar nova tarefa
              </TransparentButton>
            </>
          ) : (
            <>
              <Text style={styles.noTasks}>Sem tarefas atribuídas.</Text>
              <TransparentButton
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/(task)/create",
                    params: { childId: child.id },
                  })
                }
              >
                Criar nova tarefa
              </TransparentButton>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 24,
  },
  childHeader: {
    backgroundColor: "#0A3B46",
    borderWidth: 1,
    borderColor: "#518692",
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  taskList: {
    marginTop: 16,
    gap: 16,
  },
  noTasks: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
});
