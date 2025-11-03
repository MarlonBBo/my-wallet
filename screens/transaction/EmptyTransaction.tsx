import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export function EmptyTransaction() {

    const { colorScheme } = useColorScheme();
    const theme = THEME[colorScheme ?? 'light']

  return (
    <View className="flex-1 justify-center items-center p-4 gap-3 mt-32">
      <Feather name="repeat" color={theme.foreground} size={50} />
      <Text className="text-lg font-semibold">Nenhuma transação encontrada</Text>
      <Text className="text-muted-foreground text-center text-sm">
        Faça um transação para ser registrada.
      </Text>

      <TouchableOpacity
        className="bg-primary px-4 py-2 rounded-xl mt-2"
        onPress={() => router.navigate("/drawer/(tabs)/home?modal=true")}
      >
        <Text className="text-background font-medium">Criar transação</Text>
      </TouchableOpacity>
    </View>
  );
}
