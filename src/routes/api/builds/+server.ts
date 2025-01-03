import { json } from "@sveltejs/kit";
import type { Build } from "$lib/components/mycomponents/table/columns.js";

// /api/builds/GET

export async function GET(event) {
    const options: ResponseInit = {
        status: 200
    }

    const loadDataPromise = new Promise<Build[]>((resolve, reject) => {
        const db = event.locals.db;
        const query = "SELECT * FROM builds";

        db.all<Build>(query, (err: Error|null, rows: Build[]) => {
            if (err) {
                reject(err);
                return ;
            }

            resolve(rows);
        });
    });

    const rows = await loadDataPromise;
    return new Response(JSON.stringify(rows), options);
}

export async function POST(event) {
    const data = await event.request.json();
    console.log(data);

    // check if framework
    const insertPromise = new Promise((resolve, reject) => {
        const db = event.locals.db;

        // parse data
        const query = `
            INSERT INTO builds(id, framework, passed, failed, skipped, hostname, date, content)
            VALUES ('${data.id}', '${data.framework}', ${data.passed}, ${data.failed}, ${data.skipped}, '${data.hostname}', '${data.date}', '${data.content}')
        `;

        console.log(query);

        db.run(query, (err: Error|null, rows: Build[]) => {
            if (err) {
                reject(err);
                return ;
            }

            resolve(rows);
        });
    });

    await insertPromise;
    return new Response(JSON.stringify({ success: true }));
}