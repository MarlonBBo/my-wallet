import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { StatusBar, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAnotationStore } from '@/store/useAnotationStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { useVisibilityStore } from '@/store/useVisibilityStore';
import { FlatList } from 'react-native-gesture-handler';
import { AnotationComponent } from './AnotationComponent';
import { EmptyAnotation } from './EmptyAnotation';
import { router } from 'expo-router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function AnotationScreen() {
  const [value, setValue] = useState<'income' | 'expense'>('income');
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { loadAnotations, anotations, loading, deleteAnotation } = useAnotationStore();
  const { activeWallet } = useWalletStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();
  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
    }, [colorScheme])
  );

  useEffect(() => {
    if (activeWallet.id) {
      loadAnotations(activeWallet.id, db);
    }
  }, [activeWallet.id, db, loadAnotations]);

  const anotationsIncome = useMemo(
    () => anotations.filter((a) => a.type === 'income'),
    [anotations]
  );
  const anotationsExpense = useMemo(
    () => anotations.filter((a) => a.type === 'expense'),
    [anotations]
  );

  const handleAnotationPress = (anotationId: number) => {
    router.push({
      pathname: '/detail-anotation',
      params: { id: anotationId.toString() }
    });
  };

  const handleDeleteAnotation = (anotationId: number) => {
    const anotation = anotations.find((a) => a.id === anotationId);
    
    if (!anotation) return;

    Alert.alert(
      "Deletar Anotação",
      `Tem certeza que deseja deletar a anotação "${anotation.title}"?\n\nEsta ação não pode ser desfeita e todos os itens relacionados serão excluídos permanentemente.`,
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
              if (activeWallet.id) {
                await deleteAnotation(anotationId, activeWallet.id, db);
              }
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar a anotação. Tente novamente.");
              console.error("Erro ao deletar anotação:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className='flex-1 bg-background'>
      <View className='mt-7 w-full'>
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconOne={
            <TouchableOpacity 
              onPress={() => {
                router.push("/create-anotation");
              }}
            >
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
        <Tabs 
          value={value} 
          onValueChange={(val) => setValue(val as 'income' | 'expense')} 
          className="w-[400px]"
        >
          <Text className='absolute font-bold text-2xl'>Anotações</Text>
          <TabsList>
            <TabsTrigger value="income">
              <Text>Entrada</Text>
            </TabsTrigger>
            <TabsTrigger value="expense">
              <Text>Saída</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card className='mr-8 p-3 h-[65vh]'>
              <FlatList
                data={anotationsIncome}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                renderItem={({ item }) => (
                  <AnotationComponent
                    anotation={item}
                    onPress={() => handleAnotationPress(item.id)}
                    onDelete={handleDeleteAnotation}
                    showDelete={true}
                  />
                )}
                ListEmptyComponent={<EmptyAnotation />}
              />
            </Card>
          </TabsContent>

          <TabsContent value="expense">
            <Card className='mr-8 p-3 h-[65vh]'>
              <FlatList
                data={anotationsExpense}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                renderItem={({ item }) => (
                  <AnotationComponent
                    anotation={item}
                    onPress={() => handleAnotationPress(item.id)}
                    onDelete={handleDeleteAnotation}
                    showDelete={true}
                  />
                )}
                ListEmptyComponent={<EmptyAnotation />}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </View>
      
      <OnboardingModal
        screenKey="anotations"
        title="Anotações"
        description="Crie anotações financeiras para planejar suas receitas e despesas futuras."
        icon="edit"
        features={[
          "Crie anotações para planejar suas finanças",
          "Adicione itens dentro de cada anotação",
          "Marque itens como concluídos conforme você realiza",
          "Acompanhe o progresso e valor atual de cada anotação",
          "Separe entre anotações de Entrada e Saída"
        ]}
      />
    </View>
  );
}

