import { QUERIES_WALLET } from "@/database/Queries";
import { WalletDto, Wallets } from "@/types/wallet";
import { SQLiteDatabase } from "expo-sqlite";

export function walletDatabase(db: SQLiteDatabase) {
  
  async function salvarCarteira(wallet: WalletDto) {
    await db.runAsync(QUERIES_WALLET.INSERT_WALLET, [wallet.name]);
  }

  async function listarCarteiras(): Promise<Wallets> {
    return await db.getAllAsync(QUERIES_WALLET.SELECT_WALLETS);
  }

  async function deletarCarteira(walletId: number) {
    await db.runAsync(QUERIES_WALLET.DELETE_WALLET, [walletId]);
  }

  return { salvarCarteira, listarCarteiras, deletarCarteira };
} 