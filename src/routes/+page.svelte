<script lang="ts">
    import SideBook from "$lib/client/SideBook.svelte";
    import type {Order} from "$lib/client/schemas";
    import { Button } from "$lib/components/ui/button/index";
    import ky from "ky";
    import {invalidateAll} from "$app/navigation";
    import {formatTime} from "$lib/utils";
    import { goto } from "$app/navigation";
    import { Side } from "@/client/common";

    export let data: {buys: any[], sells: any[], trades: any[]};
    $: buys = data.buys.sort((a: Order, b) => b.price - a.price);
    $: sells = data.sells.sort((a: Order, b) => b.price - a.price);
    $: trades = data.trades;
    export let timestamp: string = new Date().toISOString();

    let quantity: number = Math.floor(Math.random() * 10) + 1;
    let price: number = Math.floor(Math.random() * 10) + 1;

    const handlePlaceOrder = async (chosenSide: string) => {
        const res = await ky.post('/api/place', {
            json: {price, quantity, side: chosenSide}
        }).json() as {error?: string};

        if (res.error) {
            alert(res.error);
        }

        await invalidateAll();
        quantity = Math.floor(Math.random() * 10) + 1;
        price = Math.floor(Math.random() * 10) + 1;
    };

    const goToRedisVersion = () => {
        goto('/redis');
    }
</script>

<div class="container mx-auto p-4 flex flex-col">
    <div class="flex items-center gap-2 h-full relative">
        <div class="flex flex-col gap-0.5 m:mt-28 sm:mt-0">
            <div class="text-2xl font-bold text-gray-800">Orderbook (Deno + In Memory Version)</div>
            <div class="text-center text-sm text-gray-600 flex gap-2 items-center">
                (Reset once in a while) Last Updated: {new Date(timestamp).toLocaleString()}             
                <Button class="bg-blue-200 text-black hover:bg-blue-300" size="sm" on:click={goToRedisVersion}>Redis Version</Button>
            </div>
        </div>

        <div class="flex gap-3 items-center absolute bg-white justify-center p-2 rounded ring-1 container sm:w-min top-0 right-0">
            <div class="flex flex-col">
                <div class="justify-between flex gap-1">
                    <label for="price" class="text-gray-800">Price</label>
                    <input class="border rounded bg-secondary" type="number" bind:value={price} name="price"/>
                </div>
                <div class="justify-between flex">
                    <label for="quantity" class="text-gray-800">Qty</label>
                    <input class="border" type="number" bind:value={quantity} name="quantity"/>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <Button class="bg-green-950" on:click={async () => await handlePlaceOrder("buy")}>Buy</Button>
                <Button class="bg-red-950" on:click={async () => await handlePlaceOrder("sell")}>Sell</Button>
            </div>
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