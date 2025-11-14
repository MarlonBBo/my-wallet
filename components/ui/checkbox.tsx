import { cn } from '@/lib/utils';
import { TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { THEME } from '@/lib/theme';

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxProps) {
  const { colorScheme } = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      className={cn(
        'h-5 w-5 items-center justify-center rounded-md border-2',
        checked ? 'bg-primary border-primary' : 'border-input bg-background',
        disabled && 'opacity-50',
        className
      )}
      style={{
        borderColor: checked ? theme.primary : theme.border,
        backgroundColor: checked ? theme.primary : theme.background,
        minWidth: 20,
        minHeight: 20,
      }}
    >
      <View className="items-center justify-center">
        {checked && (
          <Feather
            name="check"
            size={14}
            color={theme.primaryForeground || theme.background}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

