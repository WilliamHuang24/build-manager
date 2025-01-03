import { 
    type DateValue,
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
    parseDate
} from "@internationalized/date";

import {
    type ColumnDef
} from "@tanstack/table-core"

import {
    frameworks
} from "$lib/config/frameworks"

import TableActions from "./table-actions.svelte";
import { renderComponent, renderSnippet } from "$lib/components/ui/data-table";
import { createRawSnippet } from "svelte";
import type { DateRange } from "bits-ui";

export type Build = {
    id: string;
    framework: typeof frameworks[number];
    passed: number;
    failed: number;
    skipped: number;
    hostname: string;
    date: string;

    key: string;
    content: string;
}

export const columns: ColumnDef<Build>[] = [
    {
        accessorKey: "id",
        header: () => {
            const buildHeaderSnippet = createRawSnippet(() => ({
                render: () => `<div class="px-4 text-left">Build</div>`,
            }));

            return renderSnippet(buildHeaderSnippet, "");
        },
        cell: ({ row }) => {
            const buildCellSnippet = createRawSnippet(() => {
                return {
                    render: () => `<div class="px-4 text-left">${row.original.id}</div>`
                };
            });

            return renderSnippet(buildCellSnippet, "");
        }
    },
    {
        accessorKey: "hostname",
        header: () => {
            const hostnameHeaderSnippet = createRawSnippet(() => ({
                render: () => `<div class="px-4 text-center">Hostname</div>`,
            }));

            return renderSnippet(hostnameHeaderSnippet, "");
        },
        cell: ({ row }) => {
            const cellSnippet = createRawSnippet(() => {
                return {
                    render: () => `<div class="px-4 text-center">${row.original.hostname}</div>`
                };
            });

            return renderSnippet(cellSnippet, "");
        }
    },
    {
        accessorKey: "framework",
        header: () => {
            const frameworkHeaderSnippet = createRawSnippet(() => ({
                render: () => `<div class="px-4 text-center">Framework</div>`,
            }));

            return renderSnippet(frameworkHeaderSnippet, "");
        },
        cell: ({ row }) => {
            const frameworkCellSnippet = createRawSnippet(() => {
                return {
                    render: () => `<div class="px-4 text-center">${row.original.framework}</div>`
                };
            });

            return renderSnippet(frameworkCellSnippet, "");
        },
        filterFn: (row, columnId, filterValue: string[]) => {
            const build = row.original.framework.toLowerCase();
            
            for (const el of filterValue) {
                if (build === el.toLowerCase()) {
                    return true;
                }
            }

            return false;
        },
    },
    {
        accessorKey: "date",
        header: () => {
            const dateHeaderSnippet = createRawSnippet(() => {
                return {
                    render: () => `<div class="text-right pr-14">Timestamp</div>`
                };
            });
            
            return renderSnippet(dateHeaderSnippet, "");
        },
        cell: ({ row }) => {
            const dateCellSnippet = createRawSnippet<[String]>((getDate) => {
                const date = getDate();
                return {
                    render: () => `<div class="text-right pr-8">${date}</div>`
                };
            });

            const df = new DateFormatter("en-US", {
                dateStyle: "short",
                timeStyle: "short",
            });

            return renderSnippet(
                dateCellSnippet,
                df.format((parseDate(row.original.date) as DateValue).toDate(getLocalTimeZone()))
            );
        },
        filterFn: (row, columnId, filterValue: DateRange) => {
            const target = parseDate(row.original.date);
            const filterStart = filterValue.start as CalendarDate;
            const filterEnd = filterValue.end as CalendarDate;

            return target.compare(filterStart) >= 0 && target.compare(filterEnd) <= 0;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return renderComponent(TableActions, { content: row.original.content });
        },
    },
];


