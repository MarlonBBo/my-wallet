import { QUERIES_CATEGORY } from "@/database/Queries";
import { Categories, CategoryDto } from "@/types/category";
import { SQLiteDatabase } from "expo-sqlite";

export function categoryDatabase(db: SQLiteDatabase) {

    async function saveCategory(category: CategoryDto) {
        await db.runAsync(QUERIES_CATEGORY.INSERT_CATEGORY, [
            category.wallet_id,
            category.title,
            category.type,
            category.created_at,
            category.total,
            category.icon_name,
            category.icon_lib
        ]);
    }

    async function CategoryList(wallet_id: number): Promise<Categories> {
        return await db.getAllAsync(QUERIES_CATEGORY.SELECT_CATEGORIES, [wallet_id]);
    }

    async function deleteCategory(id: number) {
        // Buscar todas as transações da categoria para ajustar o saldo da carteira
        const transactions = await db.getAllAsync<{wallet_id: number, value: number, type: string}>(
            "SELECT wallet_id, value, type FROM transactions WHERE category_id = ?",
            [id]
        );

        // Ajustar o saldo da carteira para cada transação
        for (const transaction of transactions) {
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
        }

        // Deletar a categoria (as transações serão deletadas automaticamente pelo CASCADE)
        await db.runAsync(QUERIES_CATEGORY.DELETE_CATEGORY, [id]);
    }

    async function updateCategoryTitle(id: number, title: string) {
        await db.runAsync(QUERIES_CATEGORY.UPDATE_CATEGORY_TITLE, [title, id]);
    }

    return { saveCategory, CategoryList, deleteCategory, updateCategoryTitle};
}
