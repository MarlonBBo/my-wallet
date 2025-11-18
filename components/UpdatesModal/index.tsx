import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

type UpdatesModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const updates = [
  {
    icon: "users",
    title: "Carteira Compartilhada",
    description: "Compartilhe suas carteiras com familiares e amigos para um controle financeiro colaborativo.",
  },
  {
    icon: "cloud",
    title: "Backup de Dados",
    description: "Faça backup automático dos seus dados na nuvem e restaure quando precisar.",
  },
  {
    icon: "bar-chart-2",
    title: "Relatórios Avançados",
    description: "Gere relatórios detalhados e exporte seus dados em PDF ou Excel.",
  },
  {
    icon: "bell",
    title: "Notificações Inteligentes",
    description: "Receba alertas sobre gastos excessivos e lembretes de pagamentos.",
  },
];

export function UpdatesModal({ visible, setVisible }: UpdatesModalProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShow(false);
      });
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Modal visible={show} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
        />
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
            { backgroundColor: theme.background },
          ]}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: `${theme.primary}20` }}
              >
                <Feather name="bell" size={24} color={theme.background} />
              </View>
              <View>
                <Text
                  className="text-xl font-bold"
                  style={{ color: theme.foreground }}
                >
                  Novas Atualizações
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: theme.mutedForeground }}
                >
                  Em breve
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              className="p-2"
            >
              <Feather name="x" size={20} color={theme.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            <View className="gap-4">
              {updates.map((update, index) => (
                <View
                  key={index}
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  }}
                >
                  <View className="flex-row items-start gap-3">
                    <View
                      className="w-10 h-10 rounded-lg items-center justify-center"
                      style={{ backgroundColor: `${theme.primary}15` }}
                    >
                      <Feather
                        name={update.icon as any}
                        size={20}
                        color={theme.primary}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-base font-semibold mb-1"
                        style={{ color: theme.foreground }}
                      >
                        {update.title}
                      </Text>
                      <Text
                        className="text-sm leading-5"
                        style={{ color: theme.mutedForeground }}
                      >
                        {update.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setVisible(false)}
            className="mt-4 py-3 rounded-lg items-center"
            style={{ backgroundColor: theme.primary }}
          >
            <Text
              className="text-base font-semibold"
              style={{ color: theme.primaryForeground }}
            >
              Entendi
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
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },
});

