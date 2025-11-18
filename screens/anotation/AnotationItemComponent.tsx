import { THEME } from "@/lib/theme";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Text, View, TouchableOpacity } from "react-native";
import { formatToBR } from "@/utils/FormatDate";
import { formatarValorBr } from "@/utils/FormatCurrent";
import { AnotationItemType } from "@/types/anotation";
import { Checkbox } from "@/components/ui/checkbox";
import { useVisibilityStore } from "@/store/useVisibilityStore";

type AnotationItemComponentProps = {
  item: AnotationItemType;
  onToggle?: (id: number, completed: boolean) => void;
  onDelete?: (id: number) => void;
  showDelete?: boolean;
};

export function AnotationItemComponent({
  item,
  onToggle,
  onDelete,
  showDelete = false,
}: AnotationItemComponentProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? "light"];
  const { valuesVisible } = useVisibilityStore();

  const handleToggle = () => {
    if (onToggle) {
      onToggle(item.id, !item.completed);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      activeOpacity={0.7}
      className={`border border-border rounded-2xl p-3 flex-row items-center bg-background shadow-sm mb-3 ${
        item.completed ? "opacity-60" : ""
      }`}
      style={{
        shadowColor: theme.foreground,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className={`font-semibold text-base text-foreground ${
              item.completed ? "line-through" : ""
            }`}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {showDelete && onDelete && (
            <TouchableOpacity
              onPress={() => onDelete(item.id)}
              className="ml-2 p-1"
              hitSlop={10}
            >
              <Feather name="x" size={18} color={theme.destructive} />
            </TouchableOpacity>
          )}
        </View>
        
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-muted-foreground">
            {formatToBR(item.created_at)}
          </Text>
          <Text
            className={`font-extrabold text-lg ${
              item.completed ? "text-muted-foreground" : "text-foreground"
            }`}
          >
            {valuesVisible ? formatarValorBr(item.value) : 'R$ ••••••'}
          </Text>
        </View>
      </View>

      {onToggle && (
        <View className="ml-3">
          <Checkbox
            checked={item.completed}
            disabled={true}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

