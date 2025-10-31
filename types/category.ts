import { IconDto, IconLibName } from "./iconType";

export type CategoryType = {
  id: number;
  title: string;
  wallet_id: number;
  type: "income" | "expense";
  total: number;
  icon_name: string;
  icon_lib: IconLibName;
  created_at: string;
};

export type CategoryDto = Omit<CategoryType, ("id")>;

export type Categories = CategoryType[];