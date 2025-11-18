import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { StatusBar, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionComponent } from './TransactionComponent';
import { Feather } from '@expo/vector-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTransactionsStore } from '@/store/useTransactionStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { useVisibilityStore } from '@/store/useVisibilityStore';
import { SectionList } from 'react-native';
import { EmptyTransaction } from './EmptyTransaction';
import { OnboardingModal } from '@/components/OnboardingModal';
 

type DateFilter = 'all' | 'today' | 'week' | 'month';
type TypeFilter = 'all' | 'income' | 'expense';

export function TransactionScreen() {
 
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { loadTransactions, transactions, deleteTransaction } = useTransactionsStore();
  const { activeWallet } = useWalletStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();
  const db = useSQLiteContext();

  const handleDeleteTransaction = (transaction: any) => {
    if (!transaction || !activeWallet.id) return;

    Alert.alert(
      "Deletar Transação",
      `Tem certeza que deseja deletar a transação "${transaction.title}"?\n\nEsta ação não pode ser desfeita e o saldo da carteira será atualizado.`,
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
              await deleteTransaction(transaction.id, activeWallet.id, db);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar a transação. Tente novamente.");
              console.error("Erro ao deletar transação:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      }, [colorScheme])
    );

  useEffect(() => {
      if (activeWallet.id) {
          loadTransactions(activeWallet.id, db);
      }
  }, [db, activeWallet.id, loadTransactions]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filtrar por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    // Filtrar por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter((t) => {
        const transactionDate = new Date(t.created_at);
        const transactionDateOnly = new Date(
          transactionDate.getFullYear(),
          transactionDate.getMonth(),
          transactionDate.getDate()
        );

        switch (dateFilter) {
          case 'today':
            return transactionDateOnly.getTime() === today.getTime();
          
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            weekAgo.setHours(0, 0, 0, 0);
            return transactionDateOnly.getTime() >= weekAgo.getTime();
          }
          
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            monthAgo.setHours(0, 0, 0, 0);
            return transactionDateOnly.getTime() >= monthAgo.getTime();
          }
          
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [transactions, dateFilter, typeFilter]);

  const groupedTransactions = useMemo(() => {
    const getDateLabel = (dateStr: string): string => {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Resetar horas para comparar apenas as datas
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

      if (dateOnly.getTime() === todayOnly.getTime()) {
        return 'Hoje';
      } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
        return 'Ontem';
      } else {
        // Formatar como "DD/MM/YYYY"
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
      }
    };

    const groups: { [key: string]: typeof filteredTransactions } = {};
    
    filteredTransactions.forEach((transaction) => {
      const label = getDateLabel(transaction.created_at);
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(transaction);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        // Ordenar: Hoje primeiro, depois Ontem, depois por data (mais recente primeiro)
        if (a === 'Hoje') return -1;
        if (b === 'Hoje') return 1;
        if (a === 'Ontem') return -1;
        if (b === 'Ontem') return 1;
        
        // Para outras datas, ordenar por data (mais recente primeiro)
        const dateA = new Date(groups[a][0].created_at);
        const dateB = new Date(groups[b][0].created_at);
        return dateB.getTime() - dateA.getTime();
      })
      .map((label) => ({
        title: label,
        data: groups[label],
      }));
  }, [filteredTransactions]);

    const insets = useSafeAreaInsets();
    const contentInsets = {
      top: insets.top,
      bottom: insets.bottom,
      left: 4,
      right: 40,
    };
 
  return (
    <View className='flex-1 bg-background'>
      <View className='mt-7 w-full'>
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconTwo={
            <TouchableOpacity onPress={toggleValuesVisibility}>
              <Feather 
                name={valuesVisible ? 'eye' : 'eye-off'} 
                size={20} 
                color={theme.foreground}
              />
            </TouchableOpacity>
          }
        />
      </View>
      
        <View className='px-2 gap-2 mt-12'>
               <View className='flex-row justify-between items-center pr-1'>
                    <Text className='font-bold text-2xl '>Transações</Text>
                    <DropdownMenu onOpenChange={setDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'outline'}>
                          <Feather name='filter' size={16} color={theme.foreground}/>
                          <Text>Filtros</Text>
                          {(dateFilter !== 'all' || typeFilter !== 'all') && (
                            <View className="ml-1 w-2 h-2 rounded-full bg-primary" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent insets={contentInsets} sideOffset={10} className="w-60" align="end">
                        <DropdownMenuLabel>
                          <Text>Filtrar por data:</Text>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onPress={() => {
                              setDateFilter('all');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${dateFilter === 'all' ? 'text-primary' : ''}`}>
                                Todas
                              </Text>
                              {dateFilter === 'all' && (
                                <Feather name='check' size={16} color={theme.primary}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onPress={() => {
                              setDateFilter('today');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${dateFilter === 'today' ? 'text-primary' : ''}`}>
                                Hoje
                              </Text>
                              {dateFilter === 'today' ? (
                                <Feather name='check' size={16} color={theme.primary}/>
                              ) : (
                                <Feather name='calendar' size={16} color={theme.mutedForeground}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onPress={() => {
                              setDateFilter('week');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${dateFilter === 'week' ? 'text-primary' : ''}`}>
                                Semana
                              </Text>
                              {dateFilter === 'week' ? (
                                <Feather name='check' size={16} color={theme.primary}/>
                              ) : (
                                <Feather name='calendar' size={16} color={theme.mutedForeground}/>
                              )}
                            </View>
                          </DropdownMenuItem> 
                          <DropdownMenuItem
                            onPress={() => {
                              setDateFilter('month');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${dateFilter === 'month' ? 'text-primary' : ''}`}>
                                Mês
                              </Text>
                              {dateFilter === 'month' ? (
                                <Feather name='check' size={16} color={theme.primary}/>
                              ) : (
                                <Feather name='calendar' size={16} color={theme.mutedForeground}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuLabel>
                          <Text>Filtrar por tipo:</Text>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onPress={() => {
                              setTypeFilter('all');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${typeFilter === 'all' ? 'text-primary' : ''}`}>
                                Todos
                              </Text>
                              {typeFilter === 'all' && (
                                <Feather name='check' size={16} color={theme.primary}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onPress={() => {
                              setTypeFilter('income');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${typeFilter === 'income' ? 'text-primary' : ''}`}>
                                Entradas
                              </Text>
                              {typeFilter === 'income' ? (
                                <Feather name='check' size={16} color={theme.primary}/>
                              ) : (
                                <Feather name='arrow-down-circle' size={16} color={theme.mutedForeground}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onPress={() => {
                              setTypeFilter('expense');
                              setDropdownOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between w-full">
                              <Text className={`font-medium ${typeFilter === 'expense' ? 'text-primary' : ''}`}>
                                Saídas
                              </Text>
                              {typeFilter === 'expense' ? (
                                <Feather name='check' size={16} color={theme.primary}/>
                              ) : (
                                <Feather name='arrow-up-circle' size={16} color={theme.mutedForeground}/>
                              )}
                            </View>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        {(dateFilter !== 'all' || typeFilter !== 'all') && (
                          <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                              variant="destructive"
                              onPress={() => {
                                setDateFilter('all');
                                setTypeFilter('all');
                                setDropdownOpen(false);
                              }}
                            >
                              <View className="flex-row items-center justify-between w-full">
                                <Text className='font-medium text-destructive'>Limpar filtros</Text>
                                <Feather name='x' size={16} color={theme.destructive}/>
                              </View>
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
               </View>
            <Card className='mx-1 p-3 h-[65vh]'>
              <SectionList
                sections={groupedTransactions}
                extraData={dateFilter + typeFilter}
                keyExtractor={(item) => item.id.toString()}
                removeClippedSubviews
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                renderItem={({ item }) => (
                  <TransactionComponent 
                    category={item.categoryTitle}
                    date={item.created_at}
                    title={item.title}
                    value={item.value}
                    iconName={item.iconName}
                    iconLib={item.iconLib}
                    onPress={() => handleDeleteTransaction(item)}
                    type={item.type}
                  />
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <View className="py-3 px-1 mb-1 mt-2">
                    <View className="flex-row items-center gap-2">
                      <View className="flex-1 h-px bg-border" />
                      <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                        {title}
                      </Text>
                      <View className="flex-1 h-px bg-border" />
                    </View>
                  </View>
                )}
                ListEmptyComponent={<EmptyTransaction />}
                stickySectionHeadersEnabled={false}
              />
            </Card>
        </View>
        
        <OnboardingModal
          screenKey="transactions"
          title="Transações"
          description="Aqui você encontra todas as suas transações organizadas por data."
          icon="repeat"
          features={[
            "Visualize todas as suas receitas e despesas",
            "Transações organizadas por data (Hoje, Ontem, etc.)",
            "Use os filtros para encontrar transações específicas",
            "Filtre por tipo (Entrada/Saída) e por período",
            "Toque no ícone do olho para ocultar/mostrar valores"
          ]}
        />
    </View>
  );
}