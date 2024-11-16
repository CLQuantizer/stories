<script lang="ts">
    export let orders: Array<{
        price: number;
        orders: Array<{
            id: string;
            quantity: number;
            filledQuantity: number;
            timestamp: number;
        }>;
    }>;
    export let side: 'buy' | 'sell';
    export let timestamp: string;
    let colorScheme: {
        border: string;
        bg: string;
        borderColor: string;
        text: string;
    };
    let title: string;

    // Derived values based on side
    $: {
        colorScheme = {
            border: side === 'buy' ? 'border-green-500' : 'border-red-500',
            bg: side === 'buy' ? 'bg-green-50' : 'bg-red-50',
            borderColor: side === 'buy' ? 'border-green-200' : 'border-red-200',
            text: side === 'buy' ? 'text-green-700' : 'text-red-700'
        };
        title = side === 'buy' ? 'Buy Orders' : 'Sell Orders';
    }

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const formatNumber = (num: number) => num.toFixed(2);

    const getTotalQuantity = (orders) => {
        return orders.reduce((sum, order) => sum + order.quantity, 0);
    };

    // Calculate total quantity across all orders
    $: totalQuantity = orders.reduce((sum, level) =>
        sum + getTotalQuantity(level.orders), 0);

    const getOrderWidth = (order) => {
        return `${(order.quantity / totalQuantity) * 100}%`;
    };
</script>

<div class="bg-white rounded-lg shadow p-4 {side === 'sell' ? 'mb-4' : ''}">
    <h3 class="text-lg font-semibold {colorScheme.text} mb-4">{title}</h3>
    <div class="space-y-4">
        {#each orders as priceLevel}
            <div class="border-l-4 {colorScheme.border} pl-4">
                <div class="font-semibold text-gray-800 mb-2">
                    Price Level: ${formatNumber(priceLevel.price)}
                </div>
                <div class="flex flex-row w-full">
                    {#each priceLevel.orders as order}
                        <div
                                class="{colorScheme.bg} p-3 border {colorScheme.borderColor} rounded mr-2 hover:shadow transition-shadow"
                                style="width: {getOrderWidth(order)}">
                            <div class="text-sm">
                                <div class="flex justify-between">
                                    <span class="text-gray-600">ID:</span>
                                    <span class="text-gray-800 font-mono">{order.id.slice(0, 8)}...</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Qty:</span>
                                    <span class="text-gray-800">{order.quantity}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Filled:</span>
                                    <span class="text-gray-800">{order.filledQuantity}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-600">Time:</span>
                                    <span class="text-gray-800">{formatTime(order.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
        {#if orders.length === 0}
            <div class="text-gray-500 text-center py-4">No {side} orders</div>
        {/if}
    </div>
</div>