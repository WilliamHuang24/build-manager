<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { ranges } from "$lib/config/dateranges";
    import { ChevronDown } from "lucide-svelte";

    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    let { value = $bindable("Today"), ...props } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button {...props} variant="outline" class="ml-auto mx-4">
                {value}
                <ChevronDown />
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>

    <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup bind:value={value}>
            {#each ranges as range}
                <DropdownMenu.RadioItem value={range}>
                    {range}
                </DropdownMenu.RadioItem>
            {/each}
        </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
</DropdownMenu.Root>
