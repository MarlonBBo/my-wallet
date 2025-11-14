import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { useVisibilityStore } from "@/store/useVisibilityStore";
import { useTransactionsStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";


type ChartItem = {
  value: number;
  label?: string;
};

function formatarValorGraph(valorEmCentavos: number): string {
  const valorEmReais = valorEmCentavos / 100;
  return valorEmReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface ViewProps {
  setScrollEnabled: (value: boolean) => void
}

export const MiniGraphComponent = memo(function MiniGraphComponent({ setScrollEnabled, lastTransactionId }: ViewProps & { lastTransactionId: string | null }) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { valuesVisible } = useVisibilityStore();
  const { transactions } = useTransactionsStore();
  const { activeWallet } = useWalletStore();

  // Calcular dados da semana (últimos 7 dias)
  const { data, weekRange, maxValue, hasData } = useMemo(() => {
    if (!activeWallet || transactions.length === 0) {
      return {
        data: [],
        weekRange: "",
        maxValue: 1000,
        hasData: false,
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6); // Últimos 7 dias (incluindo hoje)

    // Filtrar transações de despesas (expense) da semana
    const weekExpenses = transactions.filter((t) => {
      if (t.type !== "expense" || t.walletId !== activeWallet.id) return false;
      const transDate = new Date(t.created_at);
      const transDateOnly = new Date(
        transDate.getFullYear(),
        transDate.getMonth(),
        transDate.getDate()
      );
      return transDateOnly.getTime() >= weekStart.getTime();
    });

    // Criar array com os 7 dias
    const daysData: Array<{ value: number; label: string; date: Date }> = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      
      const dayExpenses = weekExpenses.filter((t) => {
        const transDate = new Date(t.created_at);
        const transDateOnly = new Date(
          transDate.getFullYear(),
          transDate.getMonth(),
          transDate.getDate()
        );
        return transDateOnly.getTime() === day.getTime();
      });

      const total = dayExpenses.reduce((sum, t) => sum + t.value, 0);
      const dayLabel = day.getDate().toString().padStart(2, "0");

      daysData.push({
        value: total / 100, // Converter centavos para reais
        label: dayLabel,
        date: day,
      });
    }

    // Verificar se há dados suficientes (pelo menos um dia com valor > 0)
    const hasEnoughData = daysData.some((d) => d.value > 0);

    // Calcular maxValue (arredondar para cima para melhor visualização)
    const max = Math.max(...daysData.map((d) => d.value), 0);
    const roundedMax = max > 0 ? Math.max(Math.ceil(max / 100) * 100, 100) : 1000;

    // Formatar range da semana
    const startDay = weekStart.getDate();
    const startMonth = weekStart.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    const endDay = today.getDate();
    const endMonth = today.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

    const weekRangeText = `${startDay.toString().padStart(2, "0")} ${startMonth} - ${endDay.toString().padStart(2, "0")} ${endMonth}`;

    return {
      data: daysData,
      weekRange: weekRangeText,
      maxValue: roundedMax,
      hasData: hasEnoughData,
    };
  }, [transactions, activeWallet]);

  return (
    <View style={styles.Container}>
      <View
        style={[
          styles.Card,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
        onTouchStart={() => setScrollEnabled(false)} 
        onTouchEnd={() => setScrollEnabled(true)}
      >
        <View style={{ backgroundColor: theme.card }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: theme.foreground,
                }}
              >
                Saídas da
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "bold",
                  color: theme.foreground,
                }}
              >
                Semana
              </Text>
            </View>
            <Text
              style={{
                color: theme.mutedForeground,
                marginBottom: 12,
                fontWeight: "500",
              }}
            >
              {weekRange || "Sem dados"}
            </Text>
          </View>

          {/* Gráfico */}
          {hasData ? (
            <LineChart
              data={data}
              curved
              height={150}
              areaChart
              startFillColor={theme.primary}
              endFillColor={theme.primary}
              startOpacity={0.2}
              endOpacity={0.05}
              thickness={3}
              color={theme.mutedForeground}
              hideDataPoints
              focusEnabled
              showDataPointOnFocus
              showStripOnFocus
              stripColor={`${theme.primary}20`} // transparência
              textFontSize={12}
              textColor={theme.mutedForeground}
              xAxisLabelTextStyle={{ color: theme.mutedForeground }}
              isAnimated
              animationDuration={1200}
              hideRules={false}
              rulesType="solid"
              rulesColor={`${theme.border}80`}
              rulesThickness={1}
              rulesLength={278}
              showVerticalLines={false}
              initialSpacing={5}
              endSpacing={0}
              spacing={45}
              maxValue={maxValue}
              hideYAxisText
              yAxisThickness={0}
              xAxisThickness={0}
              stepHeight={maxValue / 4}
              noOfSections={4}
              backgroundColor={theme.card}
              pointerConfig={{
                pointerStripHeight: 160,
                pointerStripWidth: 0,
                pointerVanishDelay: 0,
                activatePointersOnLongPress: false,
                showPointerStrip: true,
                pointerLabelComponent: (items: ChartItem[]) => {
                  if (!items?.length) return null;
                  const currentIndex = data.findIndex(
                    (d) => d.label === items[0].label
                  );
                  const isNearEnd = currentIndex >= data.length - 5;

                  return (
                    <View
                      style={{
                        position: "absolute",
                        top: 22,
                        left: isNearEnd ? undefined : 10,
                        right: isNearEnd ? 10 : undefined,
                        backgroundColor: theme.primary,
                        borderRadius: 8,
                        flexDirection: "column",
                        width: 80,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 4,
                        paddingHorizontal: 6,
                      }}
                    >
                      <Text
                        style={{
                          color: theme.primaryForeground,
                          fontWeight: "500",
                          fontSize: 12,
                        }}
                      >
                        Dia: {items[0].label}
                      </Text>
                      <Text
                        style={{
                          color: theme.primaryForeground,
                          fontWeight: "500",
                          fontSize: 12,
                        }}
                      >
                        {valuesVisible ? formatarValorGraph(items[0].value * 100) : 'R$ ••••••'}
                      </Text>
                    </View>
                  );
                },
                pointerComponent: () => (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: theme.primary,
                      borderWidth: 2,
                      borderColor: theme.primaryForeground,
                    }}
                  />
                ),
              }}
            />
          ) : (
            <View
              style={{
                height: 150,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
              }}
            >
              <Feather
                name="bar-chart-2"
                size={40}
                color={theme.mutedForeground}
                style={{ marginBottom: 12, opacity: 0.5 }}
              />
              <Text
                style={{
                  color: theme.foreground,
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                  marginBottom: 6,
                }}
              >
                Gráfico de Saídas
              </Text>
              <Text
                style={{
                  color: theme.mutedForeground,
                  fontSize: 13,
                  textAlign: "center",
                  lineHeight: 18,
                }}
              >
                Registre despesas nesta semana para visualizar o gráfico completo
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
        className="w-auto m-2 p-4 bg-foreground items-center justify-center rounded-3xl" 
        activeOpacity={0.7} 
        onPress={() => router.push('/drawer/(tabs)/graphs')}
      >
        <Text className="text-background text-lg font-semibold">Explorar</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}, (prev, next) => prev.lastTransactionId === next.lastTransactionId);


const styles = StyleSheet.create({
    Container: {
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -70,
    },
    Card: {
        backgroundColor: "#f5f5f5",
        height: 328,
        width: "80%",
        paddingTop: 25,
        borderRadius: 30,
        borderWidth: 1,
    },

    Header: {
        backgroundColor: "#4C5FD5",
    },
    HeaderTitle: {
        fontSize: 24,
        color: "#FFF",
        fontWeight: "bold",
    },  
})
