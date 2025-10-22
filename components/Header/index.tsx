import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";
import type { ComponentProps } from "react";
type IconsType = {
    iconOne?: ComponentProps<typeof Feather>['name'];
    iconTwo?: ComponentProps<typeof Feather>['name'];
    iconTree?: ComponentProps<typeof Feather>['name'];
}

export default function Header({iconOne, iconTwo, iconTree}: IconsType){

    const { colorScheme } = useColorScheme();
    const theme = THEME[colorScheme ?? "light"];

    const navigation = useNavigation();
      
    const handleOpenDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return(
        <View className="w-screen bg-foreground pt-3 px-3 flex-row justify-between">
            <TouchableOpacity onPress={handleOpenDrawer}>
                <Feather name="menu" size={22} color={theme.background} />
            </TouchableOpacity>

            <View className="flex-row gap-3">
                {iconOne && <Feather name={iconOne} size={20} color={theme.background} />}
                {iconTwo && <Feather name={iconTwo} size={20} color={theme.background} />}
                {iconTree && <Feather name={iconTree} size={20} color={theme.background} />}
            </View>
        </View>
    )
}