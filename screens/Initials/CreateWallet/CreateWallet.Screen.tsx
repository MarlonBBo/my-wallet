import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateWalletScreen() {

    const { colorScheme } = useColorScheme();

    return (
        <SafeAreaView className="flex-1 p-4">
            <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
            <View>
                <Text>Create Wallet Header</Text>
            </View>
            <View className="gap-2">
                <Text>Wallet Creation Form Placeholder</Text>
            </View>
            <View className="items-center">
                <TouchableOpacity className="w-4/5 p-4 bg-black items-center justify-center rounded-full" activeOpacity={0.7}>
                    <Text className="text-white text-xl font-semibold">Adicionar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-4/5 p-4 bg-black items-center justify-center rounded-full" 
                    activeOpacity={0.7}
                    onPress={() => router.push('/drawer/(tabs)/home')}
                    >
                    <Text className="text-white text-xl font-semibold">Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}