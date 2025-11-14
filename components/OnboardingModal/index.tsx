import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingModalProps = {
  screenKey: string;
  title: string;
  description: string;
  features: string[];
  icon: keyof typeof Feather.glyphMap;
};

export function OnboardingModal({
  screenKey,
  title,
  description,
  features,
  icon,
}: OnboardingModalProps) {
  const [visible, setVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const key = `@onboarding_${screenKey}`;
        const hasSeen = await AsyncStorage.getItem(key);
        if (!hasSeen) {
          setVisible(true);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();
        }
      } catch (error) {
        console.error("Erro ao verificar onboarding:", error);
      }
    };

    checkOnboarding();
  }, [screenKey]);

  const handleClose = async () => {
    try {
      const key = `@onboarding_${screenKey}`;
      await AsyncStorage.setItem(key, "true");
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    } catch (error) {
      console.error("Erro ao salvar onboarding:", error);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={StyleSheet.absoluteFill} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: theme.muted }}
            >
              <Feather name={icon} size={40} color={theme.primary} />
            </View>
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: theme.foreground }}
            >
              {title}
            </Text>
            <Text
              className="text-base text-center px-4"
              style={{ color: theme.mutedForeground }}
            >
              {description}
            </Text>
          </View>

          <View className="mb-6">
            {features.map((feature, index) => (
              <View
                key={index}
                className="flex-row items-start mb-3"
              >
                <View
                  className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5"
                  style={{ backgroundColor: theme.muted }}
                >
                  <Feather name="check" size={14} color={theme.primary} />
                </View>
                <Text
                  className="flex-1 text-base"
                  style={{ color: theme.foreground }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClose}
            className="py-4 rounded-xl items-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: theme.primaryForeground }}
            >
              Entendi, vamos começar!
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

