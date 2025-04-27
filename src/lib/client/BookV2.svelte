<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import type { Order, Side } from "@client/common";

    export let orders: Array<{
        price: number;
        orders: Array<Order>;
    }>;
    export let side: Side;

    let colorScheme: {
        border: string;
        bg: string;
        borderColor: string;
        text: string;
    };
    let title: string;

    $: {
        colorScheme = {
            border: side === 'buy' ? 'border-green-400' : 'border-pink-400',
            bg: side === 'buy' ? 'bg-green-400/20' : 'bg-pink-400/20',
            borderColor: side === 'buy' ? 'border-green-300' : 'border-pink-300',
            text: side === 'buy' ? 'text-green-300' : 'text-pink-300'
        };
        title = side === 'buy' ? 'Buy Orders' : 'Sell Orders';
    }

    const formatNumber = (num: number) => num.toFixed(2);

    const getTotalQuantity = (orders: any) => {
        return orders.reduce((sum: any, order: any) => sum + order.quantity, 0);
    };

    $: totalQuantity = orders.reduce((sum, level) =>
        sum + getTotalQuantity(level.orders), 0);

    const MIN_WIDTH = 10; // in percentage
    const MAX_WIDTH = 80; // in percentage

    const getOrderWidth = (order: Order) => {
        if (totalQuantity === 0) return `${MIN_WIDTH}%`;
        let width = (order.quantity / totalQuantity) * 100;
        width = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
        return `${width}%`;
    };

    const handleOrderClick = (order: Order) => {
        alert(JSON.stringify(order, null, 2));
    };
</script>

<div class="bg-gradient-to-br from-cyan-950/70 via-cyan-900/60 to-purple-950/70 border border-cyan-700/30 rounded-xl shadow-xl p-3">
    <h3 class="text-lg font-bold {colorScheme.text} mb-3 tracking-wide">{title}</h3>
    <div class="space-y-4 text-xs">
        {#each orders as priceLevel}
            <div class="border-l-4 {colorScheme.border} pl-3 flex items-start gap-3">
                <div class="font-bold text-cyan-300">${formatNumber(priceLevel.price)}</div>
                <div class="flex flex-row w-full gap-1">
                    {#each priceLevel.orders as order}
                        <Button 
                            on:click={() => handleOrderClick(order)}
                            class="{colorScheme.bg} p-1 border {colorScheme.borderColor} rounded-md hover:shadow-lg transition-all duration-200 
                            min-w-[24px] cursor-pointer h-4"
                            style="width: {getOrderWidth(order)}">
                            <div class="flex justify-between text-cyan-100 text-[10px]">
                                <span class="font-semibold">{order.quantity}-{order.filledQuantity}</span>
                            </div>
                        </Button>
                    {/each}
                </div>
            </div>
        {/each}

        {#if orders.length === 0}
            <div class="text-cyan-400 text-center py-4 italic">No {side} orders</div>
        {/if}
    </div>
</div>
