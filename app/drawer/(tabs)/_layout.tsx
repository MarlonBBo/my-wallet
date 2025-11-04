import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";

export default function TabLayout() {

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"]; 

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.foreground,
        tabBarInactiveTintColor: theme.ring,
        tabBarStyle: {
          position: "absolute",
          bottom: 60,
          left: 20,
          right: 20,
          backgroundColor: theme.background,
          height: 60,
          width: "auto",
          paddingBottom: 0,
          marginHorizontal: 20,
          borderRadius: 30,
          elevation: 1,
          shadowColor: "#000", 
          shadowOffset: { width: 0, height: 1 }, 
          shadowOpacity: 0.15, 
          shadowRadius: 2, 
          borderWidth: 1,
          borderColor: theme.border
        },
        tabBarIconStyle: { marginTop: 8 }
      }}
    >
      
      <Tabs.Screen
        name="home"
        options={{
          title: "Principal",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center"}}>
              <Feather size={22} name="home" color={color} />
            </View>
          ),
        }}
      />

       <Tabs.Screen
        name="transaction"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center" }}>
              <Feather size={22} name="repeat" color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="graphs"
        options={{
          title: "Gráficos",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center" }}>
              <Feather size={22} name="pie-chart" color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="category"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center" }}>
              <Feather size={22} name="clipboard" color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="anotation"
        options={{
          title: "Anotações",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center" }}>
              <Feather size={22} name="edit" color={color} />
            </View>
          ),
        }}
      />

    </Tabs>
  );
}
