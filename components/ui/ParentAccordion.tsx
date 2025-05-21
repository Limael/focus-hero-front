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
import { useRouter } from "expo-router";
import ArrowDownSVG from "../ui/ArrowDownSVG";
import CharacterButton from "../ui/CharacterButton";
import ThreeDotsSVG from "../ui/ThreeDotsSVG";
import { TransparentButton } from "../ui/TransparentButton";
import { RewardTaskCard } from "../ui/RewardTaskCard";
import { useTasksByChild } from "@/hooks/useTask";
import {
  PsychologistFamilyParent,
  PsychologistFamilyChild,
} from "@/services/userService";
import { useRewardsByChildId } from "@/hooks/useRewards";
import { RewardModal } from "./RewardModal";
import GiftSVG from "./GiftSVG";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

function ChildAccordion({ child }: { child: PsychologistFamilyChild }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { data: tasks = [], isLoading } = useTasksByChild(child.id);

  const { data: rewards = [], isLoading: loadingRewards } = useRewardsByChildId(
    child.id
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

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

  const handleClaim = () => {};

  return (
    <View style={childStyles.accordionContainer}>
      <TouchableOpacity onPress={toggle} style={childStyles.childHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <CharacterButton
            backgroundColor={child.gender === "female" ? "#962965" : "#298B96"}
          />
          <Text style={childStyles.childName}>{child.name}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ArrowDownSVG />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <Animated.View style={[childStyles.taskList, { opacity: fadeAnim }]}>
          <Text style={childStyles.sectionTitle}>Tarefas</Text>
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
            </>
          ) : (
            <Text style={childStyles.noTasks}>Sem tarefas atribuídas.</Text>
          )}

          <Text style={childStyles.sectionTitle}>Recompensas</Text>
          {loadingRewards ? (
            <ActivityIndicator color="#FFD600" size="small" />
          ) : rewards.length > 0 ? (
            rewards.map((reward) => (
              <RewardTaskCard
                key={reward.id}
                reward={reward.requiredPoints}
                isTask={false}
                rewardIcon={<GiftSVG width={80} height={86} />}
                title={reward.description}
                showReward={true}
                onPress={() => {
                  setSelectedReward(reward);
                  setModalVisible(true);
                }}
              />
            ))
          ) : (
            <Text style={childStyles.noTasks}>Nenhuma recompensa.</Text>
          )}
          <RewardModal
            visible={modalVisible}
            reward={selectedReward}
            onClose={() => setModalVisible(false)}
            onClaim={handleClaim}
            claimText=""
            secondaryText="Fechar"
            claimable={false}
            title={selectedReward?.description}
          />
        </Animated.View>
      )}
    </View>
  );
}

const childStyles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 10,
    marginLeft: 20,
  },
  sectionTitle: {
    color: "#FFD600",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 16,
    marginBottom: 4,
  },

  childHeader: {
    backgroundColor: "#17536B",
    borderWidth: 1,
    borderColor: "#1DCBE2",
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  childName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  taskList: {
    marginTop: 12,
    gap: 24,
  },
  noTasks: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
});

export function ParentAccordion({
  parent,
}: {
  parent: PsychologistFamilyParent;
}) {
  const [expanded, setExpanded] = useState(false);
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
    <View style={parentStyles.accordionContainer}>
      <TouchableOpacity onPress={toggle} style={parentStyles.parentHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <CharacterButton backgroundColor="#24A384" />
          <Text style={parentStyles.parentName}>{parent.name}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ArrowDownSVG />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <Animated.View style={[parentStyles.childList, { opacity: fadeAnim }]}>
          {parent.children.map((child) => (
            <ChildAccordion child={child} key={child.id} />
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const parentStyles = StyleSheet.create({
  accordionContainer: {
    marginBottom: 26,
  },
  parentHeader: {
    backgroundColor: "#0A3B46",
    borderWidth: 1,
    borderColor: "#518692",
    padding: 16,
    marginBottom: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  parentName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  childList: {
    marginTop: 8,
  },
});
