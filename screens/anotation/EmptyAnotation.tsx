import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export function EmptyAnotation() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <View className="flex-1 justify-center items-center p-4 gap-3 mt-32">
      <Feather name="file-text" color={theme.foreground} size={50} />
      <Text className="text-lg font-semibold">Nenhuma anotação encontrada</Text>
      <Text className="text-muted-foreground text-center text-sm">
        Crie uma anotação para organizar suas despesas e receitas planejadas.
      </Text>

      <TouchableOpacity
        className="bg-primary px-4 py-2 rounded-xl mt-2"
        onPress={() => {
          router.push("/create-anotation");
        }}
      >
        <Text className="text-background font-medium">Criar anotação</Text>
      </TouchableOpacity>
    </View>
  );
}

