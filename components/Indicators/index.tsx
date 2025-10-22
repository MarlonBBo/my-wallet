import { FlatList, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { formatValue } from "@/utils/FormatCurrent";

export function IndicatorsComponent() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const topCategories = [
    { id: 1, title: "Compras", total: 1200, isPositive: false, porcent: "-12%" },
    { id: 2, title: "Salário", total: 5000, isPositive: true, porcent: "+30%" },
    { id: 3, title: "Investimentos", total: 800, isPositive: true, porcent: "+5%" },
  ];

  return (
    <View className="px-3 mt-4">
      <FlatList
        data={topCategories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item }) => (
          <View
            className="h-[175px] w-[145px] mr-3 p-3 rounded-3xl justify-between border border-border"
            style={{ backgroundColor: theme.background}}
          >
            {/* Percentual */}
            <View
              className="self-start px-3 py-1 rounded-lg mb-2 flex-row items-center"
              style={{
                backgroundColor: item.isPositive
                  ? '#D1FADF' + "40"
                  : '#FEE4E2' + "40",
              }}
            >
              <Feather
                name={item.isPositive ? "arrow-up" : "arrow-down"}
                size={14}
                color={item.isPositive ? '#027A48' : '#B42318'}
                style={{ marginRight: 4 }}
              />
              <Text
                className="text-sm font-semibold"
                style={{
                  color: item.isPositive ? '#027A48' : '#B42318',
                }}
              >
                {item.porcent}
              </Text>
            </View>

            {/* Título */}
            <Text
              className="text-lg font-bold"
              style={{ color: theme.foreground }}
            >
              {item.title}
            </Text>

            {/* Valor */}
            <Text
              className="text-2xl font-bold"
              style={{ color: theme.foreground }}
            >
              {formatValue(item.total)}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
