<script lang="ts">
    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";

    export let content;
</script>

<Dialog.Root>
    <Dialog.Trigger>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="ghost"
          size="icon"
          class="relative size-8 p-0"
        >
          <span class="sr-only">Open menu</span>
          <Ellipsis class="size-4" />
        </Button>
      {/snippet}
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Extra Information</Dialog.Title>
        <Dialog.Description>
          { content }
        </Dialog.Description>
      </Dialog.Header>
    </Dialog.Content>
  </Dialog.Root>