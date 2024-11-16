<script>
    import Orderbook from "$lib/client/OrderbookComponent.svelte";

    export let data;
</script>
<div>
    <Orderbook {data} />
</div>