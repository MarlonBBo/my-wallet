import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View, TouchableOpacity } from "react-native";
import { formatToBR } from "@/utils/FormatDate";
import { AnotationType } from "@/types/anotation";

type AnotationComponentProps = {
  anotation: AnotationType;
  onPress?: () => void;
  onDelete?: (id: number) => void;
  showDelete?: boolean;
};

export function AnotationComponent({
  anotation,
  onPress,
  onDelete,
  showDelete = false,
}: AnotationComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="border border-border rounded-2xl p-3 flex-row items-center bg-background shadow-sm mb-3"
      style={{
        shadowColor: theme.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View className={`w-14 h-14 rounded-xl items-center justify-center border border-border ${anotation.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <Feather 
          name={'edit-3'} 
          size={24} 
          color={anotation.type === 'income' ? theme.chart2 : theme.destructive} 
        />
      </View>

      <View className="flex-1 ml-3">
        <Text className="font-semibold text-base text-foreground" numberOfLines={1}>
          {anotation.title}
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">
          {formatToBR(anotation.created_at)}
        </Text>
      </View>

      {showDelete && onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(anotation.id)}
          className="mr-2 p-2"
          hitSlop={10}
        >
          <Feather name="trash-2" size={18} color={theme.destructive} />
        </TouchableOpacity>
      )}

      <View>
        <Feather name="chevron-right" size={20} color={theme.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

