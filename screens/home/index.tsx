import { SafeAreaView } from "react-native-safe-area-context";
import { View, StatusBar, TouchableOpacity} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { MiniGraphComponent } from "@/components/Graphs/miniGraph";
import { Text } from "@/components/ui/text";
import Header from "@/components/Header";
import { IndicatorsComponent } from "@/components/Indicators";
import { useState } from "react";
import { CustomModal } from "@/components/ModalTransaction";


export default function HomeScreen() {

  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [visible, setVisible] = useState(false);

  const { colorScheme } = useColorScheme();

  return (
    <ScrollView 
      className="flex-1 bg-background"
      keyboardShouldPersistTaps="handled"
      scrollEnabled={scrollEnabled}
      showsVerticalScrollIndicator={false}
    >

      <StatusBar barStyle={colorScheme === "dark" ? "dark-content" : "light-content"} />

      <View 
        onTouchStart={() => setScrollEnabled(true)}
        className="bg-foreground w-full h-80 items-center" 
        style={{borderBottomLeftRadius: 60, borderBottomRightRadius: 60}}
        >
        <SafeAreaView className="gap-5 items-center w-full px-5">

            <Header iconOne="bell" iconTwo="eye"/>

          <View className="gap-5">
            <Text 
              className="color-background text-3xl font-bold text-center"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Principal
            </Text>
            <Text className="color-background text-2xl font-medium text-center">R$ 35.000,00</Text>
          </View>

          <TouchableOpacity 
            activeOpacity={0.7} 
            className="bg-background py-2 px-4 rounded-md"
            onPress={() => setVisible(true)}
          >
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
