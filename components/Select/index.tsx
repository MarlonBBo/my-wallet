import { THEME } from "@/lib/theme";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useWalletStore } from "@/store/useWalletStore";
import { Categories } from "@/types/category";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Keyboard, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type DropdownProps = {
  categoriaSelecionada: number | string | null;
  setCategoriaSelecionada: React.Dispatch<
    React.SetStateAction<number | string | null>
  >;
  type: "income" | "expense";
};

export function SelectComponent({
  categoriaSelecionada,
  setCategoriaSelecionada,
  type,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const db = useSQLiteContext();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const { categories, loadCategorys, filterCategories, filteredCategories } = useCategoryStore();
  const { activeWallet } = useWalletStore();

  useEffect(() => {
  if (activeWallet.id && categories.length === 0) {
    loadCategorys(activeWallet.id, db).then(() => {
      filterCategories(type);
    });
  } else {
    filterCategories(type);
  }
}, [activeWallet.id, db, type, categories.length]);
  

  const dropdownItems = useMemo(() => {
  return [
    ...filteredCategories.map((item) => ({
      label: item.title,
      value: item.id,
    })),
    { label: "+ Criar nova categoria", value: "nova-categoria" },
  ];
}, [filteredCategories]);


  return (
    <View className="w-full gap-4">
      <DropDownPicker
        searchPlaceholder="Buscar categoria..."
        open={open}
        value={categoriaSelecionada}
        items={dropdownItems}
        onPress={() => Keyboard.dismiss()}
        setOpen={setOpen}
        setValue={(callback) => {
          const value = callback(categoriaSelecionada);
          if (value === "nova-categoria") {
            setOpen(false);
            setCategoriaSelecionada(null);
            router.push("/create-category");
          } else {
            setCategoriaSelecionada(value);
          }
        }}
        placeholder="Selecione uma categoria"
        listMode="FLATLIST"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.card,
          borderRadius: 12,
          height: 50,
          paddingHorizontal: 12,
        }}
        dropDownContainerStyle={{
          borderColor: theme.border,
          backgroundColor: theme.background,
          borderRadius: 12,
          maxHeight: 300,
        }}
        textStyle={{
          fontSize: 15,
          fontWeight: "500",
          color: theme.foreground,
        }}
        placeholderStyle={{
          color: theme.mutedForeground,
          fontSize: 15,
        }}
        ArrowDownIconComponent={() => (
          <Feather
            name="chevron-down"
            size={20}
            color={theme.foreground}
          />
        )}
        ArrowUpIconComponent={() => (
          <Feather
            name="chevron-up"
            size={20}
            color={theme.foreground}
          />
        )}
      />
    </View>
  );
}
