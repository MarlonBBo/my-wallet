import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState, useMemo } from "react";
import { StatusBar, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useSQLiteContext } from "expo-sqlite";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { FlatList } from "react-native-gesture-handler";
import { TransactionComponent } from "@/screens/transaction/TransactionComponent";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { formatToBR } from "@/utils/FormatDate";
import { IconComponent } from "@/screens/category/iconComponent";

export default function DetailCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = id ? Number(id) : null;

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { filterCategoryById } = useCategoryStore();
  const { TransactionsByCategory } = useTransactionsStore();
  const { activeWallet } = useWalletStore();
  const { valuesVisible } = useVisibilityStore();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();

  const [category, setCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const loadTransactions = useCallback(async () => {
    if (categoryId && activeWallet.id) {
      const data = await TransactionsByCategory(activeWallet.id, categoryId, db);
      if (data) {
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setTransactions(sortedData);
      } else {
        setTransactions([]);
      }
    }
  }, [categoryId, activeWallet.id, db, TransactionsByCategory]);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(
        colorScheme === "dark" ? "light-content" : "dark-content"
      );
      if (categoryId && activeWallet.id) {
        const foundCategory = filterCategoryById(categoryId);
        setCategory(foundCategory);
        loadTransactions();
      }
    }, [colorScheme, categoryId, activeWallet.id, filterCategoryById, loadTransactions])
  );

  useEffect(() => {
    if (categoryId && activeWallet.id) {
      const foundCategory = filterCategoryById(categoryId);
      setCategory(foundCategory);
      loadTransactions();
    }
  }, [categoryId, activeWallet.id, filterCategoryById, loadTransactions]);

  const stats = useMemo(() => {
    if (transactions.length === 0) {
      return {
        total: 0,
        count: 0,
        average: 0,
        thisMonth: 0,
        thisMonthCount: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthTransactions = transactions.filter((t) => {
      const transDate = new Date(t.created_at);
      return (
        transDate.getMonth() === currentMonth &&
        transDate.getFullYear() === currentYear
      );
    });

    const total = transactions.reduce((acc, t) => acc + t.value, 0);
    const thisMonthTotal = thisMonthTransactions.reduce(
      (acc, t) => acc + t.value,
      0
    );
    const average = total / transactions.length;

    return {
      total,
      count: transactions.length,
      average,
      thisMonth: thisMonthTotal,
      thisMonthCount: thisMonthTransactions.length,
    };
  }, [transactions]);

  if (!categoryId || !category) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground text-lg mb-4">
          Categoria não encontrada
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-background font-semibold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="mt-7 w-full">
        <Header
          viewDrawer={false}
          bg={theme.background}
          iconColor={theme.foreground}
          iconTree={
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={20} color={theme.foreground} />
            </TouchableOpacity>
          }
        />
      </View>

      <View className="flex-1 px-5 pt-6">
        {/* Header da Categoria */}
        <View className="mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center border border-border bg-muted/30"
              style={{ backgroundColor: theme.card }}
            >
              <IconComponent icon={category.icon_name} lib={category.icon_lib} />
            </View>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground mb-1">
                {category.title}
              </Text>
              <View className="flex-row items-center gap-2">
                <Feather
                  name={category.type === "income" ? "arrow-down-circle" : "arrow-up-circle"}
                  size={14}
                  color={category.type === "income" ? "#10b981" : "#ef4444"}
                />
                <Text
                  className="text-sm font-medium"
                  style={{
                    color: category.type === "income" ? "#10b981" : "#ef4444",
                  }}
                >
                  {category.type === "income" ? "Receita" : "Despesa"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <Feather
              name="calendar"
              size={14}
              color={theme.mutedForeground}
            />
            <Text className="text-sm text-muted-foreground">
              Criada em {formatToBR(category.created_at)}
            </Text>
          </View>
        </View>

        {/* Cards de Estatísticas */}
        <View className="flex-row gap-4 mb-6">
          <Card className="flex-1 h-[20vh] p-5 bg-card border-border justify-between">
            <View className="flex-row items-center gap-2">
              <Feather
                name="dollar-sign"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {valuesVisible ? formatarValorBr(category.total) : "R$ ••••••"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {stats.count} {stats.count === 1 ? "transação" : "transações"}
            </Text>
          </Card>

          <Card className="flex-1 h-[20vh] p-5 bg-card border-border justify-between">
            <View className="flex-row items-center gap-2">
              <Feather
                name="trending-up"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Este Mês
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {valuesVisible
                ? formatarValorBr(stats.thisMonth)
                : "R$ ••••••"}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {stats.thisMonthCount}{" "}
              {stats.thisMonthCount === 1 ? "transação" : "transações"}
            </Text>
          </Card>
        </View>

        {stats.count > 0 && (
          <Card className="mb-6 p-4 bg-card border-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Feather
                  name="bar-chart-2"
                  size={16}
                  color={theme.mutedForeground}
                />
                <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Média por Transação
                </Text>
              </View>
              <Text className="text-lg font-bold text-foreground">
                {valuesVisible
                  ? formatarValorBr(stats.average)
                  : "R$ ••••••"}
              </Text>
            </View>
          </Card>
        )}

        {/* Lista de Transações */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">
              Transações
            </Text>
            <View className="flex-row items-center gap-2 bg-muted/50 px-3 py-1 rounded-full">
              <Feather
                name="list"
                size={14}
                color={theme.mutedForeground}
              />
              <Text className="text-sm font-medium text-muted-foreground">
                {stats.count} {stats.count === 1 ? "transação" : "transações"}
              </Text>
            </View>
          </View>
          <Card className="p-4 border-border flex-1">
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingBottom: Math.max(insets.bottom, 20) + 20 
              }}
              renderItem={({ item }) => (
                <TransactionComponent
                  iconName={item.iconName}
                  iconLib={item.iconLib}
                  title={item.title}
                  date={item.created_at}
                  value={item.value}
                  category={category.title}
                  type={item.type}
                />
              )}
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-16">
                  <View className="bg-muted/30 rounded-full p-6 mb-4">
                    <Feather
                      name="file-text"
                      color={theme.mutedForeground}
                      size={48}
                    />
                  </View>
                  <Text className="text-muted-foreground mt-2 text-center text-base font-medium">
                    Nenhuma transação registrada
                  </Text>
                  <Text className="text-muted-foreground mt-1 text-center text-sm">
                    As transações desta categoria aparecerão aqui
                  </Text>
                </View>
              }
            />
          </Card>
        </View>
      </View>
    </View>
  );
}

