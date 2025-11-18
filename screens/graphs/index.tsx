import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StatusBar, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useSQLiteContext } from 'expo-sqlite';
import { useVisibilityStore } from '@/store/useVisibilityStore';
import { PieChart, BarChart, LineChart } from 'react-native-gifted-charts';
import { formatarValorBr } from '@/utils/FormatCurrent';
import { IconComponent } from '@/screens/category/iconComponent';
import { OnboardingModal } from '@/components/OnboardingModal';

export function GraphsScreen() {
  const [value, setValue] = useState<'income' | 'expense'>('income');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  const db = useSQLiteContext();
  const { loadCategorys, categories, loading } = useCategoryStore();
  const { activeWallet } = useWalletStore();
  const { valuesVisible, toggleValuesVisibility } = useVisibilityStore();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(colorScheme === "dark" ? "light-content" : "dark-content");
    }, [colorScheme])
  );

  useEffect(() => {
    if (activeWallet.id) {
      loadCategorys(activeWallet.id, db);
    }
  }, [activeWallet.id, db, loadCategorys]);

  const categoriesIncome = useMemo(
    () => categories.filter((c) => c.type === 'income'),
    [categories]
  );

  const categoriesExpense = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  );

  // Cores para o gráfico
  const chartColors = useMemo(() => [
    theme.chart1,
    theme.chart2,
    theme.chart3,
    theme.chart4,
    theme.chart5,
    theme.primary,
    theme.destructive,
  ], [theme]);

  // Preparar dados para os gráficos
  const prepareChartData = (cats: typeof categories, colors: string[]) => {
    // Filtrar apenas categorias com total > 0
    const catsWithValue = cats.filter((cat) => cat.total > 0);
    const total = catsWithValue.reduce((acc, cat) => acc + cat.total, 0);
    
    if (total === 0 || catsWithValue.length === 0) return { pie: [], bar: [], line: [] };

    const pieData = catsWithValue.map((cat, index) => {
      const percentage = (cat.total / total) * 100;
      return {
        value: percentage,
        color: colors[index % colors.length],
        gradientCenterColor: colors[index % colors.length],
        focused: false,
        label: cat.title,
        total: cat.total,
        category: cat,
      };
    });

    const barData = catsWithValue.map((cat, index) => ({
      value: cat.total / 100, // Converter centavos para reais
      label: cat.title,
      frontColor: colors[index % colors.length],
      gradientColor: colors[index % colors.length],
      category: cat,
      total: cat.total,
    }));

    const lineData = catsWithValue.map((cat, index) => ({
      value: cat.total / 100,
      label: cat.title.length > 6 ? cat.title.substring(0, 6) : cat.title,
      labelTextStyle: { color: theme.mutedForeground, fontSize: 10 },
      category: cat,
      total: cat.total,
    }));

    return { pie: pieData, bar: barData, line: lineData };
  };

  const chartDataIncome = useMemo(() => prepareChartData(categoriesIncome, chartColors), [categoriesIncome, chartColors, valuesVisible, theme]);
  const chartDataExpense = useMemo(() => prepareChartData(categoriesExpense, chartColors), [categoriesExpense, chartColors, valuesVisible, theme]);

  const currentChartData = value === 'income' ? chartDataIncome : chartDataExpense;
  const currentCategories = value === 'income' ? categoriesIncome : categoriesExpense;
  const totalValue = useMemo(() => {
    const catsWithValue = currentCategories.filter((cat) => cat.total > 0);
    return catsWithValue.reduce((acc, cat) => acc + cat.total, 0);
  }, [currentCategories]);

  const maxBarValue = useMemo(() => {
    if (currentChartData.bar.length === 0) return 1000;
    const max = Math.max(...currentChartData.bar.map(item => item.value));
    return Math.ceil(max * 1.2); // 20% de margem
  }, [currentChartData.bar]);

  const renderLegend = () => {
    const data = currentChartData[chartType];
    if (data.length === 0) {
      return (
        <View className="items-center justify-center py-8">
          <Feather name="pie-chart" size={48} color={theme.mutedForeground} />
          <Text className="text-muted-foreground text-center mt-4 text-base">
            Nenhuma categoria com transações
          </Text>
        </View>
      );
    }

    return (
      <View className="mt-6 gap-3">
        {data.map((item: any, index: number) => {
          const category = item.category;
          const color = item.color || item.frontColor || theme.primary;
          // Para pie chart, já temos item.total em centavos
          // Para bar/line, item.value está em reais, então multiplicamos por 100
          const total = item.total || Math.round(item.value * 100);
          const percentage = chartType === 'pie' ? item.value.toFixed(1) : 
            totalValue > 0 ? ((total / totalValue) * 100).toFixed(1) : '0';

          return (
            <View
              key={index}
              className="flex-row items-center justify-between p-3 rounded-xl border border-border bg-card"
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: color }}
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <IconComponent
                      icon={category.icon_name}
                      lib={category.icon_lib}
                    />
                    <Text className="font-semibold text-base text-foreground flex-1" numberOfLines={1}>
                      {category.title}
                    </Text>
                  </View>
                  {chartType === 'pie' && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      {percentage}% do total
                    </Text>
                  )}
                </View>
              </View>
              <View className="items-end">
                <Text className="font-bold text-lg text-foreground">
                  {valuesVisible ? formatarValorBr(total) : 'R$ ••••••'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className='flex-1 bg-background'>
      <View className="mt-7 w-full">
        <Header 
          bg={theme.background} 
          iconColor={theme.foreground}
          iconTwo={
            <TouchableOpacity onPress={toggleValuesVisibility}>
              <Feather 
                name={valuesVisible ? 'eye' : 'eye-off'} 
                size={20} 
                color={theme.foreground}
              />
            </TouchableOpacity>
          }
        />
      </View>
      
      <ScrollView 
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className='mb-4 mt-4'>
          <Text className='font-bold text-2xl text-foreground mb-2'>Gráficos</Text>
          <Text className='text-sm text-muted-foreground mb-4'>
            Visualize a distribuição por categorias
          </Text>
          
          {/* Seletor de tipo de gráfico */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              onPress={() => setChartType('pie')}
              className={`px-4 py-2 rounded-lg border ${
                chartType === 'pie' ? 'bg-primary border-primary' : 'border-border bg-card'
              }`}
            >
              <Feather 
                name="pie-chart" 
                size={18} 
                color={chartType === 'pie' ? theme.primaryForeground : theme.foreground} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg border ${
                chartType === 'bar' ? 'bg-primary border-primary' : 'border-border bg-card'
              }`}
            >
              <Feather 
                name="bar-chart-2" 
                size={18} 
                color={chartType === 'bar' ? theme.primaryForeground : theme.foreground} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChartType('line')}
              className={`px-4 py-2 rounded-lg border ${
                chartType === 'line' ? 'bg-primary border-primary' : 'border-border bg-card'
              }`}
            >
              <Feather 
                name="trending-up" 
                size={18} 
                color={chartType === 'line' ? theme.primaryForeground : theme.foreground} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Tabs 
          value={value} 
          onValueChange={(val) => setValue(val as 'income' | 'expense')} 
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="income">
              <Text>Entrada</Text>
            </TabsTrigger>
            <TabsTrigger value="expense">
              <Text>Saída</Text>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <View className="mt-4">
              <View className="items-center mb-6">
                <Text className="text-lg font-bold text-foreground mb-2">
                  Total de Entradas
                </Text>
                <Text className="text-3xl font-bold text-foreground">
                  {valuesVisible ? formatarValorBr(totalValue) : 'R$ ••••••'}
                </Text>
              </View>

              {currentChartData[chartType].length > 0 ? (
                <View className="items-center">
                  {chartType === 'pie' && (
                    <View className="relative">
                      <PieChart
                        data={currentChartData.pie}
                        radius={120}
                        innerRadius={60}
                        innerCircleColor={theme.background}
                        focusOnPress
                        showGradient
                        donut
                        isAnimated
                        animationDuration={800}
                      />
                      <View 
                        className="absolute items-center justify-center"
                        style={{
                          width: 120,
                          height: 120,
                        }}
                      >
                      </View>
                    </View>
                  )}

                  {chartType === 'bar' && (
                    <View className="w-full">
                      <BarChart
                        data={currentChartData.bar}
                        width={Math.max(300, currentChartData.bar.length * 50)}
                        height={280}
                        barWidth={30}
                        spacing={Math.max(20, 40 - currentChartData.bar.length * 2)}
                        roundedTop
                        roundedBottom
                        hideRules
                        xAxisThickness={1}
                        xAxisColor={theme.border}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 9, textAlign: 'center', width: 60 }}
                        showXAxisIndices
                        noOfSections={4}
                        maxValue={maxBarValue}
                        isAnimated
                        animationDuration={800}
                        showGradient
                        frontColor={theme.primary}
                        gradientColor={theme.chart2}
                        showVerticalLines={false}
                      />
                    </View>
                  )}

                  {chartType === 'line' && (
                    <View className="w-full">
                      <LineChart
                        data={currentChartData.line}
                        width={300}
                        height={220}
                        thickness={3}
                        color={theme.primary}
                        curved
                        areaChart
                        startFillColor={theme.primary}
                        endFillColor={theme.primary}
                        startOpacity={0.3}
                        endOpacity={0.1}
                        hideRules
                        hideYAxisText
                        xAxisThickness={0}
                        yAxisThickness={0}
                        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
                        isAnimated
                        animationDuration={800}
                        spacing={40}
                        initialSpacing={30}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View className="items-center justify-center py-12">
                  <Feather name="bar-chart-2" size={64} color={theme.mutedForeground} />
                  <Text className="text-muted-foreground text-center mt-4 text-base">
                    Nenhuma categoria de entrada com transações
                  </Text>
                </View>
              )}

              {renderLegend()}
            </View>
          </TabsContent>

          <TabsContent value="expense">
            <View className="mt-4">
              <View className="items-center mb-6">
                <Text className="text-lg font-bold text-foreground mb-2">
                  Total de Saídas
                </Text>
                <Text className="text-3xl font-bold text-foreground">
                  {valuesVisible ? formatarValorBr(totalValue) : 'R$ ••••••'}
                </Text>
              </View>

              {currentChartData[chartType].length > 0 ? (
                <View className="items-center">
                  {chartType === 'pie' && (
                    <View className="relative">
                      <PieChart
                        data={currentChartData.pie}
                        radius={120}
                        innerRadius={60}
                        innerCircleColor={theme.background}
                        focusOnPress
                        showGradient
                        donut
                        isAnimated
                        animationDuration={800}
                      />
                      <View 
                        className="absolute items-center justify-center"
                        style={{
                          width: 120,
                          height: 120,
                        }}
                      >
                      </View>
                    </View>
                  )}

                  {chartType === 'bar' && (
                    <View className="w-full">
                      <BarChart
                        data={currentChartData.bar}
                        width={Math.max(300, currentChartData.bar.length * 50)}
                        height={280}
                        barWidth={30}
                        spacing={Math.max(20, 40 - currentChartData.bar.length * 2)}
                        roundedTop
                        roundedBottom
                        hideRules
                        xAxisThickness={1}
                        xAxisColor={theme.border}
                        yAxisThickness={0}
                        yAxisTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 9, textAlign: 'center', width: 60 }}
                        noOfSections={4}
                        maxValue={maxBarValue}
                        isAnimated
                        animationDuration={800}
                        showGradient
                        frontColor={theme.destructive}
                        gradientColor={theme.chart1}
                        showVerticalLines={false}
                      />
                    </View>
                  )}

                  {chartType === 'line' && (
                    <View className="w-full">
                      <LineChart
                        data={currentChartData.line}
                        width={300}
                        height={220}
                        thickness={3}
                        color={theme.destructive}
                        curved
                        areaChart
                        startFillColor={theme.destructive}
                        endFillColor={theme.destructive}
                        startOpacity={0.3}
                        endOpacity={0.1}
                        hideRules
                        hideYAxisText
                        xAxisThickness={0}
                        yAxisThickness={0}
                        xAxisLabelTextStyle={{ color: theme.mutedForeground, fontSize: 10 }}
                        isAnimated
                        animationDuration={800}
                        spacing={40}
                        initialSpacing={30}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View className="items-center justify-center py-12">
                  <Feather name="bar-chart-2" size={64} color={theme.mutedForeground} />
                  <Text className="text-muted-foreground text-center mt-4 text-base">
                    Nenhuma categoria de saída com transações
                  </Text>
                </View>
              )}

              {renderLegend()}
            </View>
          </TabsContent>
         </Tabs>
      </ScrollView>
      
      <OnboardingModal
        screenKey="graphs"
        title="Gráficos"
        description="Visualize a distribuição das suas finanças através de gráficos interativos."
        icon="pie-chart"
        features={[
          "Veja gráficos de pizza, barras e linhas",
          "Analise a distribuição por categorias",
          "Compare receitas e despesas separadamente",
          "Use os botões para alternar entre tipos de gráfico",
          "A legenda mostra detalhes de cada categoria"
        ]}
      />
    </View>
  );
}

