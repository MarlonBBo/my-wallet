import { SelectComponent } from "@/components/Select";
import { useColorScheme } from "nativewind";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { THEME } from "@/lib/theme";
import { router } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import { useWalletStore } from "@/store/useWalletStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useSQLiteContext } from "expo-sqlite";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { handleChange } from "@/utils/TransformInInteger";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { TransactionDto } from "@/types/transactions";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Loader2 } from "lucide-react-native";

export default function IncomeScreen() {

  const db = useSQLiteContext();

  const [valorCentavos, setValorCentavos] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | string | null>(null);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const valorFormatado = useMemo(() => {
    return valorCentavos === 0 ? '' : formatarValorBr(valorCentavos);
  }, [valorCentavos]);

  const handleValueChange = useCallback((text: string) => {
    handleChange(text, setValorCentavos);
  }, []);

  const { activeWallet } = useWalletStore();
  const { filterCategoryById } = useCategoryStore();
  const { addTransaction } = useTransactionsStore();
  const { valuesVisible } = useVisibilityStore();

  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const handleAddTransaction = async () => {
    setIsLoading(true);

    // Validação do valor
    if (valorCentavos <= 0) {
      setIsLoading(false);
      Alert.alert("Erro", "Por favor, informe o valor da transação.");
      return;
    }

    // Validação da categoria
    if (!categoriaSelecionada) {
      setIsLoading(false);
      Alert.alert("Erro", "Por favor, selecione uma categoria.");
      return;
    }

    // Validação da categoria no store
    const CatSelected = filterCategoryById(Number(categoriaSelecionada));
    if (!CatSelected) {
      setIsLoading(false);
      Alert.alert("Erro", "Categoria selecionada não encontrada. Por favor, selecione outra categoria.");
      return;
    }

    try {
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
      router.back();
    } catch (error) {
      console.log("Erro ao adicionar transação: ", error);
      Alert.alert("Erro", "Não foi possível salvar a transação. Tente novamente.");
    } finally {
      setIsLoading(false);
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
              {valuesVisible ? formatarValorBr(activeWallet.balance) : 'R$ ••••••'}
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
          Qual é o valor da transação?
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
        value={valorFormatado}
        onChangeText={handleValueChange}
        autoFocus={false}
        blurOnSubmit={false}
        returnKeyType="done"
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

        {isLoading ?
          <Button disabled className="absolute bottom-20 w-full self-center rounded-md">
            <View className="pointer-events-none animate-spin">
              <Icon as={Loader2} className="text-primary-foreground" />
            </View>
            <Text>Por favor, aguarde</Text>
          </Button>
          :
          (<Button onPress={() => handleAddTransaction()} className="absolute bottom-20 w-full self-center rounded-md">
            <Text className="text-background text-base font-semibold">
              Salvar Transação
            </Text>
          </Button>)
        }
    </View>
  );
}
