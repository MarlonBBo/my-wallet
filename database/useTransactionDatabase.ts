import { QUERIES_TRANSACTION } from "@/database/Queries";
import { TransactionDto, Transactions } from "@/types/transactions";
import { SQLiteDatabase } from "expo-sqlite";

export function transactionDatabase(db: SQLiteDatabase) {

   async function saveTransaction(transaction: TransactionDto) {
        await db.runAsync(QUERIES_TRANSACTION.INSERT_TRANSACTION, [
            transaction.walletId,
            transaction.categoryId,
            transaction.type,
            transaction.value,
            transaction.created_at,
            transaction.title,
            transaction.iconCategory
        ]);

        if (transaction.type === "income") {
            await db.runAsync(
            `UPDATE wallets SET balance = balance + ? WHERE id = ?`,
            [transaction.value, transaction.walletId]
            );
            await db.runAsync(
            `UPDATE categories SET total = total + ? WHERE id = ?`,
            [transaction.value, transaction.categoryId]
            ); 

        } else if (transaction.type === "expense") {
            await db.runAsync(
            `UPDATE wallets SET balance = balance - ? WHERE id = ?`,
            [transaction.value, transaction.walletId]
            );
            await db.runAsync(
            `UPDATE categories SET total = total + ? WHERE id = ?`,
            [transaction.value, transaction.categoryId]
            );
        }
    }


    async function TransactionsList(wallet_id: number): Promise<Transactions> {
        return await db.getAllAsync(QUERIES_TRANSACTION.SELECT_TRANSACTIONS, [wallet_id]);
    }

    async function TransactionsByCategory(wallet_id: number, category_id: number): Promise<Transactions> {
        return await db.getAllAsync(QUERIES_TRANSACTION.SELECT_TRANSACTIONS_BY_CATEGORY, [wallet_id, category_id]);
    }

    return { saveTransaction, TransactionsList, TransactionsByCategory };
}
