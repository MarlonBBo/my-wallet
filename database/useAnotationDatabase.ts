import { QUERIES_ANOTATION } from "@/database/Queries";
import { AnotationDto, AnotationItemDto, AnotationItens, Anotations } from "@/types/anotation";
import { SQLiteDatabase } from "expo-sqlite";

export function anotationDatabase(db: SQLiteDatabase) {

    async function saveAnotation(anotation: AnotationDto) {
        await db.runAsync(QUERIES_ANOTATION.INSERT_ANOTATION, [
            anotation.title,
            anotation.type,
            anotation.wallet_id,
            anotation.created_at
        ]);
    }

    async function anotationsList(wallet_id: number): Promise<Anotations>{
        return await db.getAllAsync(QUERIES_ANOTATION.SELECT_ANOTATIONS, [wallet_id]);
    }

    async function saveItem(item: AnotationItemDto){
        await db.runAsync(QUERIES_ANOTATION.INSERT_ANOTATIONITEM, [
            item.anotation_id,
            item.category_id,
            item.title,
            item.value,
            item.completed,
            item.created_at
        ])
    }

    async function itemList(anotation_id: number): Promise<AnotationItens>{
        return await db.getAllAsync(QUERIES_ANOTATION.SELECT_ANOTATIONSITENS, [anotation_id]);
    }

    async function checkItem(id: number, completed: boolean) {
       await db.runAsync(QUERIES_ANOTATION.UPDATE_CHECKITEM, [completed, id]);
    }

    async function deleteItem(id: number) {
      await db.runAsync(
        "DELETE FROM anotations_itens WHERE id = ?;",
        [id]
      );
    }

    return { 
        saveAnotation, 
        anotationsList, 
        saveItem, 
        itemList, 
        checkItem,
        deleteItem
    };
}
