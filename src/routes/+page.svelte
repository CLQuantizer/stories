<script lang="ts">
    import SideBook from "$lib/client/SideBook.svelte";
    import type {Order} from "$lib/client/schemas";
    import { Button } from "$lib/components/ui/button/index";
    import ky from "ky";
    import {invalidateAll} from "$app/navigation";

    export let data: {buys: any[], sells: any[]};
    $: buys = data.buys.sort((a:Order, b) => b.price - a.price);
    $: sells = data.sells.sort((a:Order, b) => b.price - a.price);
    export let timestamp: string = new Date().toISOString();
    let quantity:number = Math.floor(Math.random() * 10) + 1;
    let price:number = Math.floor(Math.random() * 10) + 1;


    const handlePlaceOrder = async (chosenSide:string) => {
        const res = await ky.post('/api/place', {
            json: {price, quantity, side: chosenSide}}).json() as {error?:string};
        if (res.error) {
            alert(res.error);
        }
        await invalidateAll();
        quantity = Math.floor(Math.random() * 10) + 1;
        price = Math.floor(Math.random() * 10) + 1;

    }
</script>

<div class="container mx-auto p-4 flex flex-col">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-800">Orderbook (Reset once in a while)</h2>
        <div class="flex gap-2">
            <!--     placeholder is the highest price in the buy orders -->
            <div>
                <label for="price" class="text-gray-800">Price</label>
                <input class="border rounded bg-secondary" type="number" bind:value={price} name="price"/>
            </div>
            <div>
                <label for="quantity" class="text-gray-800">Quantity</label>
                <input class="border" type="number" bind:value={quantity} name="quantity"/>
            </div>
            <Button class="bg-green-950" on:click={async ()=> await handlePlaceOrder("buy")}>Buy</Button>
            <Button class="bg-red-950" on:click={async ()=> await handlePlaceOrder("sell")}>Sell</Button>
        </div>
    </div>

    <SideBook orders={sells} side="sell" {timestamp} />
    <SideBook orders={buys} side="buy" {timestamp} />
    <div class="mt-6 text-center text-sm text-gray-600">
        Last Updated: {new Date(timestamp).toLocaleString()}
    </div>
</div>