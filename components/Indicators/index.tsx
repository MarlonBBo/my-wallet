import { FlatList, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { formatValue } from "@/utils/FormatCurrent";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useMemo } from "react";

export function IndicatorsComponent() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { valuesVisible } = useVisibilityStore();
  const { categories } = useCategoryStore();
  const { transactions } = useTransactionsStore();
  const { activeWallet } = useWalletStore();

  // Calcular indicadores de desempenho baseados nas transações reais
  const topCategories = useMemo(() => {
    if (!activeWallet || categories.length === 0) {
      return [];
    }

    // Filtrar categorias da carteira ativa
    const walletCategories = categories.filter(
      (cat) => cat.wallet_id === activeWallet.id && cat.total > 0
    );

    // Calcular totais do mês atual e mês anterior para cada categoria
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const categoryStats = walletCategories
      .map((category) => {
        // Total do mês atual
        const currentMonthTotal = transactions
          .filter((t) => {
            if (t.categoryId !== category.id) return false;
            const transDate = new Date(t.created_at);
            return (
              transDate.getMonth() === currentMonth &&
              transDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, t) => sum + t.value, 0);

        // Total do mês anterior
        const previousMonthTotal = transactions
          .filter((t) => {
            if (t.categoryId !== category.id) return false;
            const transDate = new Date(t.created_at);
            return (
              transDate.getMonth() === previousMonth &&
              transDate.getFullYear() === previousYear
            );
          })
          .reduce((sum, t) => sum + t.value, 0);

        // Só incluir categorias com transações no mês atual
        if (currentMonthTotal === 0) {
          return null;
        }

        // Calcular variação percentual
        let porcent = "0%";
        let isPositive = true;

        if (previousMonthTotal > 0) {
          const variation = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
          porcent = `${variation >= 0 ? "+" : ""}${variation.toFixed(0)}%`;
          isPositive = variation >= 0;
        } else if (currentMonthTotal > 0) {
          porcent = "+100%";
          isPositive = true;
        }

        return {
          id: category.id,
          title: category.title,
          total: currentMonthTotal,
          isPositive: category.type === "income" ? isPositive : !isPositive, // Inverter para despesas
          porcent,
        };
      })
      .filter((stat) => stat !== null) as Array<{
        id: number;
        title: string;
        total: number;
        isPositive: boolean;
        porcent: string;
      }>;

    // Ordenar por total (maior primeiro) e pegar top 3
    return categoryStats
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  }, [categories, transactions, activeWallet]);

  // Se não houver dados suficientes, mostrar mensagem informativa
  if (topCategories.length === 0) {
    return (
      <View className="px-3 mt-4">
        <View
          className="h-[175px] w-full p-5 rounded-3xl justify-center items-center border border-border"
          style={{ backgroundColor: theme.background }}
        >
          <Feather
            name="trending-up"
            size={32}
            color={theme.mutedForeground}
            style={{ marginBottom: 12 }}
          />
          <Text
            className="text-base font-semibold text-center mb-2"
            style={{ color: theme.foreground }}
          >
            Indicadores de Desempenho
          </Text>
          <Text
            className="text-sm text-center px-4"
            style={{ color: theme.mutedForeground }}
          >
            Os indicadores aparecerão aqui quando você tiver transações suficientes no mês atual
          </Text>
        </View>
      </View>
    );
  }

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
              {valuesVisible ? formatValue(item.total) : 'R$ ••••••'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
