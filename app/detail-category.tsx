import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { THEME } from "@/lib/theme";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState, useMemo } from "react";
import { StatusBar, TouchableOpacity, View, ScrollView, Alert, TextInput, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useSQLiteContext } from "expo-sqlite";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { useWalletStore } from "@/store/useWalletStore";
import { TransactionComponent } from "@/screens/transaction/TransactionComponent";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { formatToBR } from "@/utils/FormatDate";
import { IconComponent } from "@/screens/category/iconComponent";

export default function DetailCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categoryId = id ? Number(id) : null;

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { filterCategoryById, deleteCategory, updateCategoryTitle, loadCategorys } = useCategoryStore();
  const { TransactionsByCategory, loading: transactionsLoading, loadTransactions } = useTransactionsStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();
  const { activeWallet, loadWallets } = useWalletStore();
  const db = useSQLiteContext();

  const [category, setCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(
        colorScheme === "dark" ? "light-content" : "dark-content"
      );
      if (categoryId && activeWallet.id) {
        const categoryData = filterCategoryById(categoryId);
        setCategory(categoryData);
        
        TransactionsByCategory(activeWallet.id, categoryId, db).then((data) => {
          if (data) {
            setTransactions(data);
          } else {
            setTransactions([]);
          }
        });
      }
    }, [colorScheme, categoryId, activeWallet.id, db, filterCategoryById, TransactionsByCategory])
  );

  const handleEditCategory = () => {
    if (category) {
      setNewTitle(category.title);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!category || !activeWallet.id || !newTitle.trim()) return;
    
    try {
      await updateCategoryTitle(category.id, newTitle.trim(), activeWallet.id, db);
      await loadCategorys(activeWallet.id, db);
      await loadTransactions(activeWallet.id, db);
      const updatedCategory = filterCategoryById(category.id);
      if (updatedCategory) {
        setCategory(updatedCategory);
      }
      // Recarregar transações da categoria para atualizar o nome
      const updatedTransactions = await TransactionsByCategory(activeWallet.id, category.id, db);
      if (updatedTransactions) {
        setTransactions(updatedTransactions);
      }
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a categoria. Tente novamente.");
      console.error("Erro ao atualizar categoria:", error);
    }
  };

  const handleDeleteCategory = () => {
    if (!category || !activeWallet.id) return;

    Alert.alert(
      "Deletar Categoria",
      `Tem certeza que deseja deletar a categoria "${category.title}"?\n\nEsta ação não pode ser desfeita e todas as transações relacionadas serão excluídas permanentemente.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category.id, activeWallet.id, db);
              await loadWallets(db);
              router.back();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar a categoria. Tente novamente.");
              console.error("Erro ao deletar categoria:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (categoryId && activeWallet.id) {
      const categoryData = filterCategoryById(categoryId);
      setCategory(categoryData);
      
      TransactionsByCategory(activeWallet.id, categoryId, db).then((data) => {
        if (data) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      });
    }
  }, [categoryId, activeWallet.id, db, filterCategoryById, TransactionsByCategory]);

  // Agrupar transações por data
  const groupedTransactions = useMemo(() => {
    const getDateLabel = (dateStr: string): string => {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hoje';
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Ontem';
      } else {
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
      }
    };

    const groups: { [key: string]: typeof transactions } = {};
    
    transactions.forEach((transaction) => {
      const label = getDateLabel(transaction.created_at);
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(transaction);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'Hoje') return -1;
        if (b === 'Hoje') return 1;
        if (a === 'Ontem') return -1;
        if (b === 'Ontem') return 1;
        
        const dateA = new Date(groups[a][0].created_at);
        const dateB = new Date(groups[b][0].created_at);
        return dateB.getTime() - dateA.getTime();
      })
      .map((label) => ({
        title: label,
        data: groups[label],
      }));
  }, [transactions]);

  // Calcular estatísticas
  const totalValue = transactions.reduce((acc, t) => acc + t.value, 0);
  const totalTransactions = transactions.length;
  const averageValue = totalTransactions > 0 ? totalValue / totalTransactions : 0;

  // Calcular total do mês atual
  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter((t) => {
        const transDate = new Date(t.created_at);
        return (
          transDate.getMonth() === currentMonth &&
          transDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, t) => acc + t.value, 0);
  }, [transactions]);

  if (!categoryId || !category) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Categoria não encontrada</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-primary px-6 py-3 rounded-xl"
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
          iconOne={
            <TouchableOpacity onPress={handleEditCategory}>
              <Feather name="edit-2" size={20} color={theme.foreground} />
            </TouchableOpacity>
          }
          iconTwo={
            <TouchableOpacity onPress={handleDeleteCategory}>
              <Feather name="trash-2" size={20} color={theme.destructive} />
            </TouchableOpacity>
          }
          iconTree={
            <TouchableOpacity onPress={toggleValuesVisibility}>
              <Feather 
                name={valuesVisible ? 'eye' : 'eye-off'} 
                size={20} 
                color={theme.foreground}
              />
            </TouchableOpacity>
          }
          iconFour={
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="log-out" size={20} color={theme.foreground} />
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-5 pt-6">
        {/* Header da Categoria */}
        <View className="mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-20 h-20 rounded-2xl items-center justify-center border-2 border-border bg-muted/30">
              <IconComponent icon={category.icon_name} lib={category.icon_lib} />
            </View>
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground mb-1">
                {category.title}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      category.type === "income"
                        ? "#D1FADF40"
                        : "#FEE4E240",
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{
                      color:
                        category.type === "income" ? "#027A48" : "#B42318",
                    }}
                  >
                    {category.type === "income" ? "Receita" : "Despesa"}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Feather
                    name="calendar"
                    size={14}
                    color={theme.mutedForeground}
                  />
                  <Text className="text-sm text-muted-foreground">
                    {formatToBR(category.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Cards de Estatísticas */}
        <View className="flex-row gap-4 mb-6">
          <Card className="flex-1 h-[15vh] p-5 bg-card border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather
                name="dollar-sign"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Total Geral
              </Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              {valuesVisible ? formatarValorBr(totalValue) : 'R$ ••••••'}
            </Text>
          </Card>

          <Card className="flex-1 h-[15vh] p-5 bg-card border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather
                name="trending-up"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Este Mês
              </Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              {valuesVisible ? formatarValorBr(currentMonthTotal) : 'R$ ••••••'}
            </Text>
          </Card>
        </View>

        <View className="flex-row gap-4 mb-6">
          <Card className="flex-1 h-[15vh] p-5 bg-card border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather
                name="list"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Transações
              </Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              {totalTransactions}
            </Text>
          </Card>

          <Card className="flex-1 h-[15vh] p-5 bg-card border-border">
            <View className="flex-row items-center gap-2 mb-2">
              <Feather
                name="bar-chart-2"
                size={16}
                color={theme.mutedForeground}
              />
              <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Média
              </Text>
            </View>
            <Text className="text-lg font-bold text-foreground">
              {valuesVisible ? formatarValorBr(averageValue) : 'R$ ••••••'}
            </Text>
          </Card>
        </View>

        {/* Lista de Transações */}
        <View>
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
                {totalTransactions} {totalTransactions === 1 ? 'transação' : 'transações'}
              </Text>
            </View>
          </View>
          <Card className="p-4 border-border mb-12">
            {groupedTransactions.length > 0 ? (
              groupedTransactions.map((section) => (
                <View key={section.title}>
                  <View className="py-3 px-1 mb-1 mt-2">
                    <View className="flex-row items-center gap-2">
                      <View className="flex-1 h-px bg-border" />
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                        {section.title}
                      </Text>
                      <View className="flex-1 h-px bg-border" />
                    </View>
                  </View>
                  {section.data.map((item) => (
                    <TransactionComponent
                      key={item.id}
                      category={item.categoryTitle}
                      date={item.created_at}
                      title={item.title}
                      value={item.value}
                      iconName={item.iconName}
                      iconLib={item.iconLib}
                      type={item.type}
                    />
                  ))}
                </View>
              ))
            ) : (
              <View className="justify-center items-center py-16">
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
            )}
          </Card>
        </View>
        </View>
      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View 
            className="w-full rounded-2xl p-6"
            style={{ backgroundColor: theme.background }}
          >
            <Text className="text-xl font-bold mb-4" style={{ color: theme.foreground }}>
              Editar Nome da Categoria
            </Text>
            
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Nome da categoria"
              placeholderTextColor={theme.mutedForeground}
              className="border rounded-xl p-3 mb-4"
              style={{
                borderColor: theme.border,
                color: theme.foreground,
                backgroundColor: theme.card,
              }}
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                className="flex-1 py-3 rounded-xl border items-center"
                style={{ borderColor: theme.border }}
              >
                <Text style={{ color: theme.foreground }}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="flex-1 py-3 rounded-xl items-center"
                style={{ backgroundColor: theme.primary }}
                disabled={!newTitle.trim()}
              >
                <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>
                  Salvar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

