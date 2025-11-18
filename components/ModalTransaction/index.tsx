import { THEME } from "@/lib/theme";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

type ModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export function CustomModal({ visible, setVisible }: ModalProps) {
  const router = useRouter();

  const { filterByDate } = useTransactionsStore();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [show, setShow] = useState(visible);

  const totalSaidasHoje = filterByDate(new Date().toString(), "expense");

  const totalEntradasHoje = filterByDate(new Date().toString(), "income");

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
          <View style={styles.cardsRow}>
            <TouchableOpacity
              onPress={() => {router.push('/expense'), setVisible(false)}}
              style={[
                styles.card,
                { backgroundColor: theme.background, borderColor: theme.foreground },
              ]}
            >
              <MaterialIcons
                name="money-off"
                size={32}
                color={theme.foreground}
                style={styles.icon}
              />
              <Text style={[styles.cardTitle, { color: theme.foreground }]}>
                Despesas
              </Text>
              <Text style={[styles.cardValue, { color: theme.foreground }]}>
                {formatarValorBr(totalSaidasHoje)}
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.foreground }]}>
                Suas despesas do dia
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {router.push('/income'), setVisible(false)}}
              style={[
                styles.card,
                { backgroundColor: theme.background, borderColor: theme.foreground },
              ]}
            >
              <MaterialIcons
                name="attach-money"
                size={32}
                color={theme.foreground}
                style={styles.icon}
              />
              <Text style={[styles.cardTitle, { color: theme.foreground }]}>
                Receitas
              </Text>
              <Text style={[styles.cardValue, { color: theme.foreground }]}>
                {formatarValorBr(totalEntradasHoje)}
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.foreground }]}>
                Suas receitas do dia
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setVisible(false)}
            style={[styles.closeButton, { backgroundColor: theme.foreground }]}
          >
            <Text style={{ color: theme.background, fontWeight: "bold" }}>
              Fechar
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 280,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    padding: 16,
    justifyContent: "center",
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
