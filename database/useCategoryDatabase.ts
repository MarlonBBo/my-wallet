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

    return { saveCategory, CategoryList};
}
