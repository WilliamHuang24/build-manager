<script lang="ts" generics="TData, TValue">
    import {
        type ColumnDef,
        type PaginationState,
        type ColumnFiltersState,
        getCoreRowModel,
        getPaginationRowModel,
        getFilteredRowModel,
    } from "@tanstack/table-core";

    import {
        createSvelteTable,
        FlexRender,
    } from "$lib/components/ui/data-table/index.js";

    import * as Table from "$lib/components/ui/table/index.js";
    import * as Pagination from "$lib/components/ui/pagination/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-svelte';

    import { 
        type DateRange,
        getDateRange,
        ranges 
    } from "$lib/config/dateranges";

    import {
        frameworks
    } from "$lib/config/frameworks";



    type DataTableProps<TData, TValue> = {
        columns: ColumnDef<TData, TValue>[];
        data: TData[];
    };

    let { data, columns }: DataTableProps<TData, TValue> = $props();
    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let columnFilters = $state<ColumnFiltersState>([]);
    let selectedFrameworks = new Map(frameworks.map((framework) => [framework, true]));
    let rangeChoice = $state<string>("Today");

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            get pagination() {
                return pagination;
            },
            get columnFilters() {
                return columnFilters;
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") {
                pagination = updater(pagination);
            } else {
                pagination = updater;
            }
        },
        onColumnFiltersChange: (updater) => {
            if (typeof updater === "function") {
                columnFilters = updater(columnFilters);
            } else {
                columnFilters = updater;
            }
        },
    });

    table.getColumn("date")?.setFilterValue(getDateRange(rangeChoice));
</script>

<div class="flex flex-col px-[5%] pt-4">
    <div class="flex w-full justify-between py-4">
        <Input
            placeholder="Filter build ids..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onchange={(e) => {
                table.getColumn("id")?.setFilterValue(e.currentTarget.value);
            }}
            oninput={(e) => {
                table.getColumn("id")?.setFilterValue(e.currentTarget.value);
            }}
            class="max-w-sm"
        />

        <div class="justify-end">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="outline" class="ml-auto mx-4">
                            {rangeChoice}
                            <ChevronDown />
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
            
                <DropdownMenu.Content align="end">
                    <DropdownMenu.RadioGroup 
                        bind:value={rangeChoice}
                        onValueChange={(value) => {
                            rangeChoice = value
                            table.getColumn("date")?.setFilterValue(getDateRange(rangeChoice))
                        }}
                    >
                        {#each ranges as range}
                            <DropdownMenu.RadioItem value={range}>
                                {range}
                            </DropdownMenu.RadioItem>
                        {/each}
                    </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
            </DropdownMenu.Root>

            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="outline" class="ml-auto">
                            Frameworks
                            <ChevronDown />
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
    
                <DropdownMenu.Content align="end">
                    {#each frameworks as framework}
                        <DropdownMenu.CheckboxItem
                            checked={selectedFrameworks.get(framework)}
                            onCheckedChange={(value) => {
                                selectedFrameworks.set(framework, value);
                                table.getColumn("framework")?.setFilterValue(frameworks.filter((x) => selectedFrameworks.get(x)));
                            }}
                        >
                            {framework}
                        </DropdownMenu.CheckboxItem>
                    {/each}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    </div>

    <div class="rounded-md border">
        <Table.Root>
            <Table.Header class="bg-zinc-50">
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <Table.Row>
                        {#each headerGroup.headers as header (header.id)}
                            <Table.Head>
                                {#if !header.isPlaceholder}
                                    <FlexRender
                                        content={header.column.columnDef.header}
                                        context={header.getContext()}
                                    />
                                {/if}
                            </Table.Head>
                        {/each}
                    </Table.Row>
                {/each}
            </Table.Header>
            <Table.Body>
                {#each table.getRowModel().rows as row (row.id)}
                    <Table.Row data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <Table.Cell>
                                <FlexRender
                                    content={cell.column.columnDef.cell}
                                    context={cell.getContext()}
                                />
                            </Table.Cell>
                        {/each}
                    </Table.Row>
                {:else}
                    <Table.Row>
                        <Table.Cell
                            colspan={columns.length}
                            class="h-24 text-center"
                        >
                            No results.
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </div>

    <div class="mt-4">
        <!-- pagination -->
        <Pagination.Root
            count={data.length}
            perPage={pagination.pageSize}
            onPageChange={(p) => table.setPageIndex(p - 1)}
        >
            {#snippet children({ pages, currentPage })}
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.PrevButton>
                            <ChevronLeft class="size-4" />
                            <span class="hidden sm:block">Previous</span>
                        </Pagination.PrevButton>
                    </Pagination.Item>
                    {#each pages as page (page.key)}
                        {#if page.type === "ellipsis"}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        {:else}
                            <Pagination.Item>
                                <Pagination.Link
                                    {page}
                                    isActive={currentPage === page.value}
                                >
                                    {page.value}
                                </Pagination.Link>
                            </Pagination.Item>
                        {/if}
                    {/each}
                    <Pagination.Item>
                        <Pagination.NextButton>
                            <span class="hidden sm:block">Next</span>
                            <ChevronRight class="size-4" />
                        </Pagination.NextButton>
                    </Pagination.Item>
                </Pagination.Content>
            {/snippet}
        </Pagination.Root>
    </div>
</div>
