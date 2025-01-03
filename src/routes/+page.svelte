<script lang="ts">
    import Table from "$lib/components/mycomponents/table/table.svelte";

    import {
        columns,
        type Build,
    } from "$lib/components/mycomponents/table/columns.js";
    import { CalendarDate } from "@internationalized/date";
    import { onMount } from "svelte";

    // const tempValues: Build[] = [
    //     { id: "build1", framework: "Mosaic", date: new CalendarDate(2024, 12, 25), passed: 120, failed: 2, skipped: 2, hostname: "bob@1.1", key: "1"},
    //     { id: "build2", framework: "Ultra", date: new CalendarDate(2024, 12, 2), passed: 130, failed: 1, skipped: 2, hostname: "bob@1.1", key: "1" },
    //     { id: "build3", framework: "Eagle", date: new CalendarDate(2024, 12, 3), passed: 110, failed: 3, skipped: 2, hostname: "ste@1.3", key: "1" },
    //     { id: "build15", framework: "UltrixCarbonite", date: new CalendarDate(2024, 11, 27), passed: 110, failed: 3, skipped: 2, hostname: "ste@1.3", key: "1"},
    // ];

    let { data }: { data: any } = $props();
</script>

<nav
    class="flex-no-wrap relative flex w-full items-center justify-between bg-zinc-50 py-4 px-8 shadow-dark-mild lg:flex-wrap lg:justify-start lg:py-4"
>
    <div class="flex w-full flex-wrap items-center justify-between px-4">
        <h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
            Build Manager
        </h3>
    </div>
</nav>

{#if data}
    <Table data={data.builds} {columns}></Table>
{:else}
    <div class="w-full text-center pt-20">
        <p class="leading-7 [&:not(:first-child)]:mt-6">
            Loading ...
        </p>
    </div>
{/if}

