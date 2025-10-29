import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionComponent } from './TransactionComponent';
import { Feather } from '@expo/vector-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
 

export function TransactionScreen() {
 
  const [value, setValue] = useState('account');
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      }, [colorScheme])
    );

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
          iconOne='plus'
          iconTwo='eye'
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
            <Card className='p-3 mt-2'>
            <TransactionComponent
                icon='bar-chart-2'
                title='Refrigerante'
                category='Estoque'
                value='+20.000,00'
                date='10/10/2025 12:30'
                onPress={() => console.log('say hello')}
            />
            
            <TransactionComponent
                icon='bar-chart-2'
                title='Refrigerante'
                category='Estoque'
                value='-20.000,00'
                date='10/10/2025 12:30'
                onPress={() => console.log('say hello')}
            />
            <TransactionComponent
                icon='bar-chart-2'
                title='Refrigerante'
                category='Estoque'
                value='-20.000,00'
                date='10/10/2025 12:30'
                onPress={() => console.log('say hello')}
            />
            <TransactionComponent
                icon='bar-chart-2'
                title='Refrigerante'
                category='Estoque'
                value='+20.000,00'
                date='10/10/2025 12:30'
                onPress={() => console.log('say hello')}
            />
            <TransactionComponent
                icon='bar-chart-2'
                title='Refrigerante'
                category='Estoque'
                value='+20.000,00'
                date='10/10/2025 12:30'
                onPress={() => console.log('say hello')}
            />
            </Card>
        </View>
    </View>
  );
}