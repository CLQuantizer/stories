<script lang="ts">
    import SideBook from "$lib/client/SideBook.svelte";

    import { Button } from "$lib/components/ui/button/index";
    import ky from "ky";
    import {invalidateAll} from "$app/navigation";
    import {formatTime} from "$lib/utils";
    import { goto } from "$app/navigation";
    import { Side } from "@/client/common";
    import { pop } from "@/client/store";

    export let data: {buys: any[], sells: any[], trades: any[]};
    $: buys = data.buys.sort((a, b) => b.price - a.price);
    $: sells = data.sells.sort((a, b) => b.price - a.price);
    $: trades = data.trades;
    export let timestamp: string = new Date().toISOString();

    let bid_quantity: number = Math.floor(Math.random() * 10) + 1;
    let bid_price: number = Math.floor(Math.random() * 10) + 1;
    let ask_quantity: number = Math.floor(Math.random() * 10) + 1;
    let ask_price: number = Math.floor(Math.random() * 10) + 1;

    const handlePlaceOrder = async (chosenSide: 'buy' | 'sell') => {
        const price = chosenSide === 'buy' ? bid_price : ask_price;
        const quantity = chosenSide === 'buy' ? bid_quantity : ask_quantity;
        const res = await ky.post('/api/place', {
            json: {price, quantity, side: chosenSide}
        }).json() as {error?: string};

        if (res.error) {
            alert(res.error);
        }

        await invalidateAll();
        bid_quantity = Math.floor(Math.random() * 10) + 1;
        bid_price = Math.floor(Math.random() * 10) + 1;
        ask_quantity = Math.floor(Math.random() * 10) + 1;
        ask_price = Math.floor(Math.random() * 10) + 1;
    };

</script>

<div class="container mx-auto p-4 flex flex-col">
    <div class="flex items-center justify-between gap-2 h-full relative">
        <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl font-bold text-gray-800">BidCoin vs AskCoin Orderbook</h1>
            <p class="text-sm text-gray-600">
                Last Updated: {new Date(timestamp).toLocaleString()} (data resets periodically)
            </p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div class="flex flex-col gap-2 items-center bg-white justify-center p-2 rounded-lg border">
            <img src="/bid.webp" alt="BidCoin" class="w-12 h-12 rounded-full object-cover opacity-50 hover:opacity-100 transition-all"/>
            <h2 class="text-xl font-semibold">BidCoin</h2>
            <div class="w-full">
                <label for="bid_price" class="text-gray-800">Price</label>
                <input class="w-full border rounded bg-secondary p-2" type="number" bind:value={bid_price} name="bid_price"/>
            </div>
            <div class="w-full">
                <label for="bid_quantity" class="text-gray-800">Quantity</label>
                <input class="w-full border rounded p-2" type="number" bind:value={bid_quantity} name="bid_quantity"/>
            </div>
            <Button class="bg-green-950 w-full" on:click={() => handlePlaceOrder('buy')}>Buy BidCoin</Button>
        </div>

        <div class="flex flex-col gap-2 items-center bg-white justify-center p-2 rounded-lg border">
            <img src="/ask.webp" alt="AskCoin" class="w-12 h-12 rounded-full object-cover opacity-50 hover:opacity-100 transition-all"/>
            <h2 class="text-xl font-semibold">AskCoin</h2>
            <div class="w-full">
                <label for="ask_price" class="text-gray-800">Price</label>
                <input class="w-full border rounded bg-secondary p-2" type="number" bind:value={ask_price} name="ask_price"/>
            </div>
            <div class="w-full">
                <label for="ask_quantity" class="text-gray-800">Quantity</label>
                <input class="w-full border rounded p-2" type="number" bind:value={ask_quantity} name="ask_quantity"/>
            </div>
            <Button class="bg-red-950 w-full" on:click={() => handlePlaceOrder('sell')}>Sell AskCoin</Button>
        </div>
    </div>

    <div>
        <SideBook orders={sells} side={Side.Sell} />
        <SideBook orders={buys} side={Side.Buy} />
    </div>

    <div class="text-xs gap-2 flex-col flex bg-white mt-2">
        <div class="font-semibold">Trades: (timestamp - quantity - price)</div>
        <div class="flex flex-wrap gap-1 mb-1">
            {#each trades as trade}
                <div class="p-0.5 border rounded flex flex-col text-xs hover:ring hover:bg-secondary">
                    {formatTime(trade.timestamp)} - {trade.quantity} - {trade.price}
                </div>
            {/each}
        </div>
    </div>
</div>