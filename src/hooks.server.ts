import type { Handle } from "@sveltejs/kit";
import sqlite3 from 'sqlite3';

export const handle: Handle = async ({ event, resolve }) => {
    if (!event.locals.db) {
        // This will create the database within the `db.sqlite` file.
        const db = new sqlite3.Database('db.sqlite', (err: any) => {
            if (err) {
                throw err;
            }
        });

        // Set the db as our events.db variable.
        event.locals.db = db

        // We can create a basic table in the db
        const query = `
            CREATE TABLE IF NOT EXISTS builds (
                key INTEGER PRIMARY KEY AUTOINCREMENT,
                id TEXT, 
                framework TEXT,
                passed INTEGER,
                failed INTEGER,
                skipped INTEGER,
                hostname TEXT,
                date TEXT,
                content BLOB
            )  
        `;

        db.run(query, (err: any) => {
            if (err) {
                throw err
            }
        })
    }
    const resp = await resolve(event);
    return resp;
};