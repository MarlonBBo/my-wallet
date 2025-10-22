import { FlatList } from "react-native-gesture-handler";
import {
  NativeSelectScrollView,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Strawberry', value: 'strawberry' },
  { label: 'Orange', value: 'orange' },
  { label: 'Lemon', value: 'lemon' },
  { label: 'Kiwi', value: 'kiwi' },
  { label: 'Mango', value: 'mango' },
  { label: 'Pomegranate', value: 'pomegranate' },
  { label: 'Watermelon', value: 'watermelon' },
  { label: 'Peach', value: 'peach' },
  { label: 'Pear', value: 'pear' },
  { label: 'Plum', value: 'plum' },
  { label: 'Raspberry', value: 'raspberry' },
  { label: 'Tangerine', value: 'tangerine' },
];

export function SelectComponent(){

    const insets = useSafeAreaInsets();
    const contentInsets = {
        top: insets.top,
        bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
        left: 12,
        right: 12
    };

    return(
        <Select>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a categoria" />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-[180px] max-h-[250px]">
            <FlatList
            data={fruits}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
                <SelectItem label={item.label} value={item.value}>
                {item.label}
                </SelectItem>
            )}
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 250 }}
            />
        </SelectContent>
    </Select>
    )
}