import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { Feather } from "@expo/vector-icons";

export function ThemeSwitch() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [checked, setChecked] = useState(colorScheme === "dark");

  useEffect(() => {
    // sincroniza o estado caso o tema mude externamente
    setChecked(colorScheme === "dark");
  }, [colorScheme]);

  const handleToggle = (value: boolean) => {
    setChecked(value);
    setColorScheme(value ? "dark" : "light");
  };

  return (
    <View className="flex-row items-center gap-5 px-3 py-3">

        <Switch checked={checked} onCheckedChange={handleToggle} />

      <View className="flex-row items-center gap-2">
        <Feather
          name={checked ? "moon" : "sun"}
          size={20}
          color={checked ? "#f1f1f1" : "#222"}
        />
        <Text className="text-base font-medium text-foreground">
          {checked ? "Modo escuro" : "Modo claro"}
        </Text>
      </View>

    </View>
  );
}
