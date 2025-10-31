import { SelectComponent } from "@/components/Select";
import { useColorScheme } from "nativewind";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";

export default function IncomeScreen() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <View
      className="flex-1 bg-background px-6"
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <SafeAreaView className="w-full mt-8">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 items-center">
            <Text
              className="text-sm font-medium px-3 py-1 rounded-md"
              style={{
                color: theme.background,
                backgroundColor: theme.foreground,
              }}
            >
              Saldo atual
            </Text>
            <Text
              className="text-xl font-semibold mt-1 border-b px-2 text-center"
              style={{
                color: theme.foreground,
                borderColor: theme.border,
              }}
            >
              R$ 35.000,00
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute right-0 top-0"
          >
            <Feather name="x" size={26} color={theme.foreground} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View className="mt-8 mb-4">
        <Text
          className="text-xl font-bold text-center"
          style={{ color: theme.foreground }}
        >
          Qual é o valor da transferência?
        </Text>
      </View>

      <TextInput
        className="text-4xl font-extrabold text-center"
        style={{
          color: theme.foreground,
        }}
        placeholder="R$ 0,00"
        placeholderTextColor={theme.ring}
        keyboardType="numeric"
      />

      <View className="mt-10 w-full gap-6 items-center">
        <TextInput
          className="w-full text-center text-base border-b pb-2 italic"
          style={{
            color: theme.foreground,
            borderColor: theme.border,
          }}
          placeholder="Título da transação"
          placeholderTextColor={theme.ring}
        />

        <SelectComponent />
      </View>

      {/* Botão de salvar */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute bottom-20 w-full self-center py-3 rounded-md "
        style={{ backgroundColor: theme.foreground }}
      >
        <Text
          className="text-center font-semibold"
          style={{ color: theme.background }}
        >
          Salvar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
