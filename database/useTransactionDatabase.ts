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
            transaction.iconName,
            transaction.iconLib
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

    async function deleteTransaction(id: number) {
        // Buscar a transação para obter os dados necessários antes de deletar
        const transaction = await db.getFirstAsync<{wallet_id: number, category_id: number, value: number, type: string}>(
            "SELECT wallet_id, category_id, value, type FROM transactions WHERE id = ?",
            [id]
        );

        if (!transaction) {
            throw new Error("Transação não encontrada");
        }

        // Ajustar o saldo da carteira
        if (transaction.type === "income") {
            // Se era receita, subtrair do saldo
            await db.runAsync(
                "UPDATE wallets SET balance = balance - ? WHERE id = ?",
                [transaction.value, transaction.wallet_id]
            );
        } else if (transaction.type === "expense") {
            // Se era despesa, adicionar ao saldo (reverter)
            await db.runAsync(
                "UPDATE wallets SET balance = balance + ? WHERE id = ?",
                [transaction.value, transaction.wallet_id]
            );
        }

        // Deletar a transação
        await db.runAsync(QUERIES_TRANSACTION.DELETE_TRANSACTION, [id]);
    }

    return { saveTransaction, TransactionsList, TransactionsByCategory, deleteTransaction };
}
