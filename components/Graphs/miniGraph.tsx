import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";


type ChartItem = {
  value: number;
  label?: string;
};

function formatarValorGraph(valorEmCentavos: number): string {
  const valorEmReais = valorEmCentavos ;
  return valorEmReais.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface ViewProps {
  setScrollEnabled: (value: boolean) => void
}

export function MiniGraphComponent({setScrollEnabled}: ViewProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"]; 

  const data = [
    { value: 800.0, label: "01" },
    { value: 300.4, label: "02" },
    { value: 500.8, label: "03" },
    { value: 100.0, label: "04" },
    { value: 1000.0, label: "05" },
    { value: 120.8, label: "06" },
    { value: 600.0, label: "07" },
  ];

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
              01 Jan - 07 Jan
            </Text>
          </View>

          {/* Gráfico */}
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
            maxValue={1000}
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            stepHeight={50}
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
                      {formatarValorGraph(items[0].value)}
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
        </View>
        <TouchableOpacity 
        className="w-auto m-2 p-4 bg-foreground items-center justify-center rounded-3xl" 
        activeOpacity={0.7} 
        
      >
        <Text className="text-background text-lg font-semibold">Explorar</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    Container: {
        width: "auto",
        justifyContent: "center",
        alignItems: "center",
        marginTop: -70,
    },
    Card: {
        backgroundColor: "#f5f5f5",
        height: 324,
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
