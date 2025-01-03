import type { Build } from "$lib/components/mycomponents/table/columns.js";

export const load = async () => {
    const response = await fetch('http://localhost:5173/api/builds');
    const builds: Build[] = await response.json();

    return { builds };
}