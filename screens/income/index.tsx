import { SelectComponent } from "@/components/Select";
import { useColorScheme } from "nativewind";
import { StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons"
import { THEME } from "@/lib/theme";
import { router } from "expo-router";


export default function IncomeScreen(){

    const { colorScheme } = useColorScheme();
    const theme = THEME[colorScheme ?? "light"];

    return(
        <View className="flex-1 items-center bg-background">
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
            <SafeAreaView className="flex-row items-center justify-center w-full relative mt-7">
                <View>
                    <Text className="color-background bg-foreground rounded-md text-center font-bold">Saldo atual</Text>
                    <Text className="text-lg font-bold color-foreground border-b-2 border-border px-2 text-center">
                        R$ 35.000,00
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute right-5 top-5"
                 >
                    <Feather name="x" size={24} color={theme.foreground} />
                </TouchableOpacity>
            </SafeAreaView>

            <Text className="text-2xl font-bold color-foreground text-center">Qual é o valor da tranferência?</Text>

            <TextInput 
                className="text-3xl mt-3 color-foreground font-extrabold"
                placeholder="R$ 00,00"
                placeholderTextColor={theme.ring}
            />

            <View className="w-full gap-6 items-center mt-4 px-8">
                <TextInput
                    className="w-full border-b border-border italic color-foreground"
                    placeholder="Título da transação"
                    textAlign="center"
                    placeholderTextColor={theme.ring}
                />
                <SelectComponent/>
            </View>
        </View>
    )
}