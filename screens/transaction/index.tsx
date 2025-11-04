import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionComponent } from './TransactionComponent';
import { Feather } from '@expo/vector-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTransactionsStore } from '@/store/useTransactionStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { FlatList } from 'react-native-gesture-handler';
import { SkeletonCategoryRow } from './SkeletonComponent';
import { EmptyTransaction } from './EmptyTransaction';
 

export function TransactionScreen() {
 
  const [value, setValue] = useState('account');
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { loadTransactions, transactions, loading } = useTransactionsStore();
  const { activeWallet } = useWalletStore();
  const db = useSQLiteContext();

  useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      }, [colorScheme])
    );

  useEffect(() => {
      if (activeWallet.id) {
          loadTransactions(activeWallet.id, db);
      }
  }, [db, activeWallet.id]);

    const insets = useSafeAreaInsets();
    const contentInsets = {
      top: insets.top,
      bottom: insets.bottom,
      left: 4,
      right: 40,
    };
 
  return (
    <View className='flex-1 bg-background'>
      <SafeAreaView>
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconTwo={
            <TouchableOpacity>
              <Feather name='eye' size={20} color={theme.foreground}/>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
      
        <View className='px-2 gap-2'>
               <View className='flex-row justify-between items-center pr-1'>
                    <Text className='font-bold text-2xl '>Transações</Text>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'outline'}>
                          <Feather name='filter' size={16} color={theme.foreground}/>
                          <Text>Filtros</Text>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent insets={contentInsets} sideOffset={10} className="w-60" align="end">
                        <DropdownMenuLabel>
                          <Text>Buscar por:</Text>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Text className='font-medium'>Hoje</Text>
                            <DropdownMenuShortcut>
                              <Feather name='calendar' size={16} color={theme.foreground}/>
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Text className='font-medium'>Semana</Text>
                            <DropdownMenuShortcut>
                              <Feather name='calendar' size={16} color={theme.foreground}/>
                            </DropdownMenuShortcut>
                          </DropdownMenuItem> 
                          <DropdownMenuItem>
                            <Text className='font-medium'>Mês</Text>
                            <DropdownMenuShortcut>
                              <Feather name='calendar' size={16} color={theme.foreground}/>
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator/>
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <Text className='font-medium'>Saída</Text>
                            <DropdownMenuShortcut>
                              <Feather name='arrow-up-circle' size={16} color={theme.foreground}/>
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Text className='font-medium'>Entrada</Text>
                            <DropdownMenuShortcut>
                              <Feather name='arrow-down-circle' size={16} color={theme.foreground}/>
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
               </View>
            <Card className='mx-1 p-3 h-[65vh]'>
              <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TransactionComponent 
                    category={item.categoryTitle}
                    date={item.created_at}
                    title={item.title}
                    value={item.value}
                    iconName={item.iconName}
                    iconLib={item.iconLib}
                    onPress={() => console.log()}
                    type={item.type}
                  />
                )}
                ListEmptyComponent={<EmptyTransaction />}
              />
            </Card>
        </View>
    </View>
  );
}