export type IconLibName =
  | "Feather"
  | "FontAwesome5"
  | "MaterialIcons"
  | "Ionicons"
  | "Entypo"
  | "MaterialCommunityIcons";

export type IconType = {
  nome: string;
  icon: string;
  lib: IconLibName;
};

export type IconDto = Omit<IconType, ("nome")>;
