<script lang="ts">
	import '../app.css';
	import {Root, Title, Description} from "$lib/components/ui/alert";
    import { popStore } from '@/client/store';
</script>

<slot></slot>

{#if $popStore.isPop}
    <Root class="fixed top-2 left-1/2 -translate-x-1/2 p-4 lg:w-1/6 m:w-full h-min z-50">
        <Title>{$popStore.title}</Title>
        <Description>{$popStore.msg}</Description>
    </Root>
{/if}
