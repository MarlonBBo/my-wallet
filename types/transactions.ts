
export type TransactionType = {
  id: number;
  walletId: number;
  categoryId: number;
  categoryTitle?: string;
  value: number;
  title: string;
  iconCategory: string;
  type: "income" | "expense";
  created_at: string;
};

export type TransactionDto = Omit<TransactionType, 'id'>;

export type Transactions = TransactionType[];