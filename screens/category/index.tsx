import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryComponent } from './categoryComponent';
import { Feather } from '@expo/vector-icons'
import { useCategoryStore } from '@/store/useCategoryStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { FlatList } from 'react-native-gesture-handler';
import { IconDto } from '@/types/iconType';
import { EmptyCategory } from './EmptyCategory';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCategoryRow } from './SkeletonComponent';
import { categoryDatabase } from '@/database/useCategoryDatabase';
 

export function CategoryScreen() {
 
  const [value, setValue] = useState('account');

  const db = useSQLiteContext();

  const { loadCategorys, categories, loading } = useCategoryStore();
  const { activeWallet } = useWalletStore();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  useFocusEffect(
      useCallback(() => {
        StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
      }, [colorScheme])
    );

  useEffect(() => {
        if(activeWallet.id){
          loadCategorys(activeWallet.id, db);
        }
    }, [activeWallet.id, db]);


  const CategoriesIncome = categories.filter((c) => c.type === 'income')
  const CategoriesExpense = categories.filter((c) => c.type === 'expense')
 
  return (
    <View className='flex-1 bg-background'>
      <SafeAreaView>
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconOne={
            <TouchableOpacity onPress={() => router.push('/create-category')}>
              <Feather name='plus' size={20} color={theme.foreground}/>
            </TouchableOpacity>
          }
          iconTwo={
            <TouchableOpacity>
              <Feather name='eye' size={20} color={theme.foreground}/>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
      
      <View className='px-2'>
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
          <Card className='mr-8 p-3 h-[65vh]'>
          <FlatList
            data={CategoriesIncome}
            keyExtractor={(cat) => cat.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {
         
              return(
                <CategoryComponent
                  date={item.created_at}
                  title={item.title}
                  value={item.total}
                  icon={item.icon_name}
                  lib={item.icon_lib}
                />
              )}}
            ListEmptyComponent={ loading ? <SkeletonCategoryRow/> : <EmptyCategory />}
          />
            
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className='mr-8 p-3 h-[65vh]'>
            <FlatList
            data={CategoriesExpense}
            keyExtractor={(cat) => cat.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => {

              return(
                <CategoryComponent
                  date={item.created_at}
                  title={item.title}
                  value={item.total}
                  icon={item.icon_name}
                  lib={item.icon_lib}
                />
              )}}
            ListEmptyComponent={ loading ? <SkeletonCategoryRow /> : <EmptyCategory />}
          />

          </Card>
        </TabsContent>
      </Tabs>
      </View>

    </View>
  );
}