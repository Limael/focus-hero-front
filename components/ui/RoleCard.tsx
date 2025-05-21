import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";

type RoleCardProps = {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  cardColor?: string;
  borderColor?: string;
  iconBgColor?: string;
  iconBorderColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  rightAction?: React.ReactNode;
};

export function RoleCard({
  title,
  subtitle,
  icon,
  cardColor = "#27965A",
  borderColor = "#51f5b6",
  iconBgColor = "#227e4d",
  iconBorderColor = "#A7F2CB",
  titleColor = "#fff",
  subtitleColor = "#e7fff2",
  style = {},
  titleStyle = {},
  subtitleStyle = {},
  rightAction,
}: RoleCardProps) {
  return (
    <View
      style={[styles.card, { backgroundColor: cardColor, borderColor }, style]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: iconBgColor, borderColor: iconBorderColor },
        ]}
      >
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: titleColor }, titleStyle]}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 8,
    paddingLeft: 10,
    margin: 8,
    minWidth: 220,
    maxWidth: 340,
    elevation: 4,
    borderWidth: 2,
  },
  iconWrapper: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 1,
    opacity: 0.86,
  },
  rightAction: {
    marginLeft: 8,
    alignSelf: "center",
  },
});
