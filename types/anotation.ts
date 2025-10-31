
export type AnotationType = {
  id: number;
  title: string;
  wallet_id: number;
  type: "income" | "expense";
  created_at: string;
};

export type AnotationDto = Omit<AnotationType, ("id")>;

export type Anotations = AnotationType[];

export type AnotationItemType = {
  id: number;
  anotation_id: number;
  category_id: number | string | null;
  title: string;
  value: number;
  completed: boolean;
  created_at: string;
}

export type AnotationItemDto = Omit<AnotationItemType, ("id")>;

export type AnotationItens = AnotationItemType[];