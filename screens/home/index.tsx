import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, TouchableOpacity} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { MiniGraphComponent } from "@/components/Graphs/miniGraph";
import { Text } from "@/components/ui/text";
import Header from "@/components/Header";
import { IndicatorsComponent } from "@/components/Indicators";
import { use, useCallback, useEffect, useState } from "react";
import { CustomModal } from "@/components/ModalTransaction";
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/lib/theme";
import { useFocusEffect, useLocalSearchParams, router } from "expo-router";
import { useWalletStore } from "@/store/useWalletStore";
import { formatarValorBr } from "@/utils/FormatCurrent";


export default function HomeScreen() {

  const { modal } = useLocalSearchParams<{ modal?: string }>();

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [visible, setVisible] = useState(false);

  const { activeWallet } = useWalletStore();
 
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light']

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colorScheme === "dark" ? "dark-content" : "light-content");
    }, [colorScheme])
  );


  useEffect(() => {
  if (modal === "true") {
    setVisible(true)
    router.replace("/drawer/(tabs)/home") // limpa o param
  }
}, [modal])

  

  return (
    <ScrollView 
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
    >

      <View 
        onTouchStart={() => setScrollEnabled(true)}
        className="bg-foreground w-full h-80 items-center" 
        style={{borderBottomLeftRadius: 60, borderBottomRightRadius: 60}}
        >
        <SafeAreaView className="gap-5 items-center w-full px-5">

            <Header 
              bg={theme.foreground} 
              iconColor={theme.background}
              iconOne={
                <TouchableOpacity>
                  <Feather name='bell' size={20} color={theme.background}/>
                </TouchableOpacity>
              } 
              iconTwo={
                <TouchableOpacity>
                  <Feather name='eye' size={20} color={theme.background}/>
                </TouchableOpacity>
              }
            />

          <View className="gap-5">
            <Text 
              className="color-background text-3xl font-bold text-center"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {activeWallet.name}
            </Text>
            <Text className="color-background text-2xl font-medium text-center">{formatarValorBr(activeWallet.balance)}</Text>
          </View>

          <TouchableOpacity 
            activeOpacity={0.7} 
            className="bg-background py-2 px-4 rounded-md flex-row justify-center items-center"
            onPress={() => setVisible(true)}
          >
            <Feather name="dollar-sign" size={18} color={theme.foreground} />
            <Text className="color-foreground text-base font-medium text-center">Transação</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <MiniGraphComponent setScrollEnabled={setScrollEnabled}/>

      <View onTouchStart={() => setScrollEnabled(true)}>
        <IndicatorsComponent />
      </View>

      <View className="h-36"/>

      <CustomModal visible={visible} setVisible={setVisible}/>
    </ScrollView>

    
  );
}
