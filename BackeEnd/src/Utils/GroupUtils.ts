import { poolG } from '../config/db';
import { Group } from '../types/groupTypes'; //Group


export const getAllGroups = (callback: (error: Error | null, results?: Group[]) => void) => {
    const query = 'SELECT * FROM groups'; // groups

    poolG.query(query, (error, results) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null, results.rows);
    });
};
export const updateGroupById = (groupId: number, newName: string, callback: (error: Error | null) => void) => {
    const query = 'UPDATE groups SET name = $1 WHERE id = $2';

    poolG.query(query, [newName, groupId], (error) => {
        if (error) {
            console.error('Database query error:', error);
            callback(error);
            return;
        }
        callback(null);
    });
};
export const addGroupToDatabase = (name: string, callback: (error: Error | null) => void) => {
    const query = 'INSERT INTO groups (name) VALUES ($1)';
    
    poolG.query(query, [name], (error) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null);
    });
};
export const deleteGroupById = async (groupId: string): Promise<void> => {
    const client = await poolG.connect();

    try {
        await client.query('BEGIN');
        
        // אם יש צורך לעדכן או למחוק קשרים עם טבלאות אחרות (כגון product_manager_group)
        // יש לבצע את השאילתות המתאימות כאן

        // לדוגמה, אם רוצים להוציא את הקשרים לפני המחיקה:
        // await client.query('DELETE FROM product_manager_group WHERE group_id = $1', [groupId]);

        // מחיקת הקבוצה מהטבלה
        await client.query('DELETE FROM groups WHERE id = $1', [groupId]);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting group:', err);
        throw err;
    } finally {
        client.release();
    }
};