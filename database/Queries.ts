
export const QUERIES_CATEGORY = {

    INSERT_CATEGORY: `
        INSERT INTO categories (wallet_id, title, type, created_at, total, icon_name, icon_lib)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    SELECT_CATEGORIES: `
        SELECT 
            c.id,
            c.wallet_id,
            c.title,
            c.type,
            c.created_at,
            COALESCE(SUM(CASE 
                WHEN strftime('%Y-%m', t.created_at) = strftime('%Y-%m', 'now') 
                THEN t.value 
                ELSE 0 
            END), 0) as total,
            c.icon_name,
            c.icon_lib
        FROM categories c
        LEFT JOIN transactions t ON t.category_id = c.id
        WHERE c.wallet_id = ?
        GROUP BY c.id, c.wallet_id, c.title, c.type, c.created_at, c.icon_name, c.icon_lib;
    `,
    DELETE_CATEGORY: `
        DELETE FROM categories WHERE id = ?;
    `,
    UPDATE_CATEGORY_VALUE: `
        UPDATE categories SET total = total + ? WHERE id = ?;
    `,
    UPDATE_CATEGORY_TITLE: `
        UPDATE categories SET title = ? WHERE id = ?;
    `
}

export const QUERIES_TRANSACTION = {

    INSERT_TRANSACTION: `
        INSERT INTO transactions (wallet_id, category_id, type, value, created_at, title, icon_name, icon_lib)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
    SELECT_TRANSACTIONS: `
        SELECT 
        t.id, t.wallet_id as walletId, t.value, t.created_at, t.category_id as categoryId, t.type, t.title,
        c.title as categoryTitle,
        c.icon_name as iconName,
        c.icon_lib as iconLib
        FROM transactions t
        LEFT JOIN categories c
        ON c.id = t.category_id
        WHERE t.wallet_id = ?;

    `,
    SELECT_TRANSACTIONS_BY_CATEGORY: `
        SELECT 
        t.id, t.wallet_id as walletId, t.value, t.created_at, t.category_id as categoryId, t.type, t.title,
        c.title as categoryTitle,
        c.icon_name as iconName,
        c.icon_lib as iconLib
        FROM transactions t
        LEFT JOIN categories c
        ON c.id = t.category_id
        WHERE t.wallet_id = ? AND t.category_id = ?;

    `,
    DELETE_TRANSACTION: `
        DELETE FROM transactions WHERE id = ?;
    `
}

export const QUERIES_WALLET = {
    INSERT_WALLET: `
        INSERT INTO wallets (name) VALUES (?);
    `,
    SELECT_WALLETS: `
        SELECT * FROM wallets;
    `,
    DELETE_WALLET: `
        DELETE FROM wallets WHERE id = ?;
    `,

    UPDATE_WALLET_BALANCE: `
        UPDATE wallets SET balance = balance + ? WHERE id = ?;
    `
}

export const QUERIES_ANOTATION = {
    INSERT_ANOTATION: `
        INSERT INTO anotations (title, type, wallet_id)
        VALUES (?, ?, ?);
    `,
    SELECT_ANOTATIONS: `
        SELECT * FROM anotations WHERE wallet_id = ?;
    `,
    DELETE_ANOTATION: `
        DELETE FROM anotations WHERE id = ?;
    `,
    INSERT_ANOTATIONITEM: `
        INSERT INTO anotations_itens (
            anotation_id,
            category_id,
            title,
            value,
            completed,
            created_at)
        VALUES(?, ?, ?, ?, ?, ?);
    `,
    UPDATE_CHECKITEM:
        `UPDATE anotations_itens
        SET completed = ?
        WHERE id = ?;
    `,

    SELECT_ANOTATIONSITENS: `
        SELECT * FROM anotations_itens WHERE anotation_id = ?;
    `,
    DELETE_ANOTATIONSITENS: `
        DELETE FROM anotations_itens WHERE id = ?;
    `,
}