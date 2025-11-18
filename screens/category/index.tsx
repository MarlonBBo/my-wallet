import Header from '@/components/Header';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { router, useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { StatusBar, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryComponent } from './categoryComponent';
import { Feather } from '@expo/vector-icons'
import { useCategoryStore } from '@/store/useCategoryStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { useVisibilityStore } from '@/store/useVisibilityStore';
import { FlatList } from 'react-native-gesture-handler';
import { IconDto } from '@/types/iconType';
import { EmptyCategory } from './EmptyCategory';
import { Skeleton } from '@/components/ui/skeleton';
import { SkeletonCategoryRow } from './SkeletonComponent';
import { categoryDatabase } from '@/database/useCategoryDatabase';
import { OnboardingModal } from '@/components/OnboardingModal';
 

export function CategoryScreen() {
 
  const [value, setValue] = useState('account');

  const db = useSQLiteContext();

  const { loadCategorys, categories, loading } = useCategoryStore();
  const { activeWallet } = useWalletStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();

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
    }, [activeWallet.id, db, loadCategorys]);

  const CategoriesIncome = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories]
  );
  const CategoriesExpense = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  );
 
  return (
    <View className='flex-1 bg-background'>
      <View className='mt-7 w-full'>
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconOne={
            <TouchableOpacity onPress={() => router.push('/create-category')}>
              <Feather name='plus' size={20} color={theme.foreground}/>
            </TouchableOpacity>
          }
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
      
      <View className='px-2 mt-12'>
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
            removeClippedSubviews
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            renderItem={({item}) => (
                <CategoryComponent
                  date={item.created_at}
                  title={item.title}
                  value={item.total}
                  icon={item.icon_name}
                  lib={item.icon_lib}
                  onPress={() => router.push({
                    pathname: "/detail-category",
                    params: { id: item.id.toString() }
                  })}
                />
            )}
            ListEmptyComponent={<EmptyCategory />}
          />
            
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card className='mr-8 p-3 h-[65vh]'>
            <FlatList
            data={CategoriesExpense}
            keyExtractor={(cat) => cat.id.toString()}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            renderItem={({item}) => (
                <CategoryComponent
                  date={item.created_at}
                  title={item.title}
                  value={item.total}
                  icon={item.icon_name}
                  lib={item.icon_lib}
                  onPress={() => router.push({
                    pathname: "/detail-category",
                    params: { id: item.id.toString() }
                  })}
                />
            )}
            ListEmptyComponent={loading ? <SkeletonCategoryRow /> : <EmptyCategory />}
          />

          </Card>
        </TabsContent>
        </Tabs>
      </View>

      <OnboardingModal
        screenKey="categories"
        title="Categorias"
        description="Organize suas transações por categorias para ter um melhor controle financeiro."
        icon="clipboard"
        features={[
          "Crie categorias personalizadas para suas receitas e despesas",
          "Visualize o total gasto ou recebido em cada categoria",
          "Use o botão + para criar novas categorias",
          "Separe suas categorias entre Entrada e Saída",
          "Cada categoria mostra o valor total acumulado"
        ]}
      />
    </View>
  );
}