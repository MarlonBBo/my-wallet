import { SelectComponent } from "@/components/Select";
import { useColorScheme } from "nativewind";
import {
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useSQLiteContext } from "expo-sqlite";
import { handleChange } from "@/utils/TransformInInteger";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { TransactionDto } from "@/types/transactions";

export default function IncomeScreen() {

  const db = useSQLiteContext();

  const [valorCentavos, setValorCentavos] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | string | null>(null);
  const [title, setTitle] = useState("");

  const { activeWallet } = useWalletStore();
  const { filterCategoryById } = useCategoryStore();
  const { addTransaction } = useTransactionsStore();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const handleAddTransaction = async () => {
    if (valorCentavos > 0 && categoriaSelecionada) {

      if (valorCentavos <= 0 || !categoriaSelecionada) return;

      const CatSelected = filterCategoryById(Number(categoriaSelecionada));
      if(!CatSelected) return;

      const transaction: TransactionDto = {
        walletId: activeWallet.id,
        categoryId: Number(categoriaSelecionada),
        value: valorCentavos,
        type: "income",
        created_at: new Date().toISOString(),
        title: title,
        iconName: CatSelected.icon_name,
        iconLib: CatSelected.icon_lib
      };
      await addTransaction(transaction, db);
      router.push("/drawer/(tabs)/home");
    }
  };

  return (
    <View
      className="flex-1 bg-background px-6"
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <View className="mt-16">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 items-center">
            <Text
              className="text-sm font-medium px-3 py-1 rounded-md"
              style={{
                color: theme.background,
                backgroundColor: theme.foreground,
              }}
            >
              Saldo atual
            </Text>
            <Text
              className="text-xl font-semibold mt-1 border-b px-2 text-center"
              style={{
                color: theme.foreground,
                borderColor: theme.border,
              }}
            >
              R$ 35.000,00
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute right-0 top-0"
          >
            <Feather name="x" size={26} color={theme.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-8 mb-4">
        <Text
          className="text-xl font-bold text-center"
          style={{ color: theme.foreground }}
        >
          Qual é o valor da transferência?
        </Text>
      </View>

      <TextInput
        className="text-4xl font-extrabold text-center"
        style={{
          color: theme.foreground,
        }}
        placeholder="R$ 0,00"
        placeholderTextColor={theme.ring}
        keyboardType="numeric"
        value={valorCentavos === 0 ? '' : formatarValorBr(valorCentavos)}
        onChangeText={(text) => handleChange(text, setValorCentavos)}
      />

      <View className="mt-10 w-full gap-6 items-center">
        <TextInput
          className="w-full text-center text-base border-b pb-2 italic"
          style={{
            color: theme.foreground,
            borderColor: theme.border,
          }}
          placeholder="Título da transação"
          placeholderTextColor={theme.ring}
          value={title}
          onChangeText={setTitle}
        />

        <SelectComponent 
          categoriaSelecionada={categoriaSelecionada}
          setCategoriaSelecionada={setCategoriaSelecionada}
          type="income"
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute bottom-20 w-full self-center py-3 rounded-md "
        style={{ backgroundColor: theme.foreground }}
        onPress={handleAddTransaction}
      >
        <Text
          className="text-center font-semibold"
          style={{ color: theme.background }}
        >
          Salvar Transação
        </Text>
      </TouchableOpacity>
    </View>
  );
}
