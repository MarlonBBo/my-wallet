import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useState } from 'react';
import { StatusBar, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryComponent } from './categoryComponent';
 

export function CategoryScreen() {
 
  const [value, setValue] = useState('account');
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      }, [colorScheme])
    );
 
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
      
      <View className=' px-2'>
        <Tabs value={value} onValueChange={setValue} className="w-[400px]">
        <Text className='absolute font-bold text-2xl '>Categorias</Text>
        <TabsList>
          <TabsTrigger value="account">
            <Text>Entrada</Text>
          </TabsTrigger>
          <TabsTrigger value="password">
            <Text>Saída</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className='mr-8 p-3'>
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className='mr-8 p-3'>
            <CategoryComponent
              icon='bold'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
            <CategoryComponent
              icon='box'
              title='Estoque'
              value='20.000,00'
              date='10/10/2025 12:30'
              onPress={() => console.log('say hello')}
            />
          </Card>
        </TabsContent>
      </Tabs>
      </View>

    </View>
  );
}