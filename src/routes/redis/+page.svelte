<script lang="ts">
    import BookV2 from "$lib/client/BookV2.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
        CardFooter
    } from "$lib/components/ui/card";
    import ky from "ky";
    import { invalidateAll } from "$app/navigation";
    import { formatTime } from "$lib/utils";
    import { Side, type Trade } from "@/client/common";

    export let data;
    $: buys = data.buy.sort((a, b) => b.price - a.price);
    $: sells = data.sell.sort((a, b) => a.price - b.price);
    $: trades = data.trades;
    export let timestamp: string = data.timestamp;

    let quantity: number = Math.floor(Math.random() * 10) + 1;
    let price: number = Math.floor(Math.random() * 10) + 1;

    const handlePlaceOrder = async (chosenSide: string) => {
        const res = await ky.post('/api/redis/place', {
            json: { price, quantity, side: chosenSide }
        }).json() as { error?: string };
        if (res.error) alert(res.error);
        await invalidateAll();
        quantity = Math.floor(Math.random() * 10) + 1;
        price = Math.floor(Math.random() * 10) + 1;
    }

    const handleReset = async () => {
        await ky.get('/api/redis/reset');
        await invalidateAll();
    }
</script>

<div class="w-full h-screen p-2 flex flex-col gap-2 text-white text-xs">
    <div class="flex flex-col sm:flex-row justify-between gap-2 w-full h-full">
        <!-- Left Section -->
        <div class="flex flex-col gap-2 w-full sm:w-1/4">
            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <h1 class="text-lg font-bold text-cyan-300">Orderbook</h1>
                    <Badge variant="secondary" class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-sm">redis</Badge>
                </div>
                <p class="text-cyan-400 text-[10px]">Updated: {new Date(timestamp).toLocaleTimeString()}</p>
            </div>
            <Card class="bg-transparent border border-cyan-700/30 shadow p-2 flex-1">
                <CardHeader class="p-1">
                    <CardTitle class="text-cyan-300 text-sm">Place Order</CardTitle>
                </CardHeader>
                <CardContent class="flex flex-col gap-1">
                    <label class="text-cyan-400 text-[10px]">Price</label>
                    <input class="border border-cyan-700 bg-cyan-900/30 rounded px-1 py-0.5 focus:ring focus:ring-cyan-600 text-white text-xs" type="number" bind:value={price} min="1" />

                    <label class="text-cyan-400 text-[10px] mt-1">Quantity</label>
                    <input class="border border-cyan-700 bg-cyan-900/30 rounded px-1 py-0.5 focus:ring focus:ring-cyan-600 text-white text-xs" type="number" bind:value={quantity} min="1" />
                </CardContent>
                <CardFooter class="flex gap-1 pt-2">
                    <Button variant="secondary" class="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xs font-bold shadow-sm hover:from-green-600 hover:to-cyan-600" on:click={() => handlePlaceOrder("buy")}>Buy</Button>
                    <Button variant="secondary" class="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow-sm hover:from-pink-700 hover:to-purple-700" on:click={() => handlePlaceOrder("sell")}>Sell</Button>
                </CardFooter>
            </Card>
            <Button variant="secondary" class="mt-2 opacity-50 text-xs font-bold shadow-sm" on:click={handleReset}>
                Reset Redis
            </Button>
        </div>

        <!-- Center Section (Sell and Buy Orders) -->
        <div class="flex flex-col gap-2 w-full sm:w-2/4">
            <Card class="bg-transparent border border-cyan-700/30 shadow p-2 flex-1">
                <CardHeader class="p-1">
                    <CardTitle class="text-cyan-300 text-sm">Sell Orders</CardTitle>
                </CardHeader>
                <CardContent class="p-1">
                    <BookV2 orders={sells} side={Side.Sell} />
                </CardContent>
            </Card>

            <Card class="bg-transparent border border-cyan-700/30 shadow p-2 flex-1">
                <CardHeader class="p-1">
                    <CardTitle class="text-cyan-300 text-sm">Buy Orders</CardTitle>
                </CardHeader>
                <CardContent class="p-1">
                    <BookV2 orders={buys} side={Side.Buy} />
                </CardContent>
            </Card>
        </div>

        <!-- Right Section (Trades) -->
        <div class="flex flex-col gap-2 w-full sm:w-1/4">
            <Card class="bg-transparent border border-cyan-700/30 shadow p-2 flex-1">
                <CardHeader class="p-1">
                    <CardTitle class="text-cyan-200 text-sm flex items-center justify-between">
                        Trades <Badge variant="outline" class="bg-cyan-800 text-cyan-300 border-cyan-600 text-[10px]">{trades.length}</Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent class="flex flex-wrap gap-1 overflow-auto max-h-[90vh]">
                    {#if trades.length === 0}
                        <Badge variant="outline" class="bg-gray-800 text-gray-400 border-gray-600 text-[10px]">No trades</Badge>
                    {:else}
                        {#each trades as trade}
                            <Badge variant="secondary" class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-[10px] border-cyan-600">
                                {formatTime(trade.timestamp)} - {trade.quantity} - {trade.price}
                            </Badge>
                        {/each}
                    {/if}
                </CardContent>
            </Card>
        </div>
    </div>
</div>