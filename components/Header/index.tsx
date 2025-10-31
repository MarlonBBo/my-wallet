import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import type { ReactNode } from "react";
type IconsType = {
    iconOne?: ReactNode;
    iconTwo?: ReactNode;
    iconTree?: ReactNode;
    bg: string;
    iconColor: string;
}

export default function Header({
    iconOne, 
    iconTwo, 
    iconTree, 
    bg, 
    iconColor
}: IconsType){

    const { colorScheme } = useColorScheme();
    const theme = THEME[colorScheme ?? "light"];

    const navigation = useNavigation();
      
    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return(
        <View className="w-screen pt-3 px-3 flex-row justify-between" style={{backgroundColor: bg}}>
            <TouchableOpacity onPress={handleOpenDrawer}>
                <Feather name="menu" size={22} color={iconColor} />
            </TouchableOpacity>

            <View className="flex-row gap-3">
                {iconOne}
                {iconTwo}
                {iconTree}
            </View>
        </View>
    )
}