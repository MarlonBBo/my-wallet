import { THEME } from "@/lib/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "nativewind";
import {
  DrawerContentScrollView,
  DrawerItemList,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { View } from "react-native";
import { Switch } from "@/components/ui/switch";
import { ThemeSwitch } from "@/components/Switch";
import { Text } from "@/components/ui/text";

export default function DrawerLayout() {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        swipeEnabled: false,
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.background,
          width: 280,
        },
        drawerActiveTintColor: theme.foreground,
        drawerLabelStyle: {
          color: theme.foreground,
          fontSize: 16,
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginVertical: 4,
          paddingLeft: 4,
        },
      }}
      drawerContent={(props: DrawerContentComponentProps) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "space-between",
            paddingBottom: 20,
          }}
        >
          <View>
            <DrawerItemList {...props} />
          </View>

          {/* Seu switch de tema no final do Drawer */}
          <View className="mb-16 ml-4 ">
            <ThemeSwitch />
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Início",
          drawerIcon: ({ size }: { size: number }) => (
            <MaterialIcons name="dashboard" size={size} color={theme.foreground} />
          ),
        }}
      />
      <Drawer.Screen
        name="wallets"
        options={{
          title: "Carteiras",
          drawerIcon: ({ size }: { size: number }) => (
            <MaterialIcons name="wallet" size={size} color={theme.foreground} />
          ),
        }}
      />
    </Drawer>
  );
}
