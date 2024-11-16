<script lang="ts">

    export let data;
    $:buys = data.buys;
    $:sells = data.sells;
    export let timestamp: string = new Date().toISOString();

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const formatNumber = (num: number) => num.toFixed(2);
</script>

<div class="max-w-7xl mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Orderbook Tree View</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Buy Orders Tree -->
        <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-semibold text-green-700 mb-4">Buy Orders</h3>
            <div class="space-y-4">
                {#each buys as priceLevel}
                    <div class="border-l-4 border-green-500 pl-4">
                        <div class="font-semibold text-gray-800 mb-2">
                            Price Level: ${formatNumber(priceLevel.price)}
                        </div>
                        <ul class="space-y-3">
                            {#each priceLevel.orders as order}
                                <li class="bg-green-50 rounded-lg p-3 hover:shadow transition-shadow">
                                    <div class="grid grid-cols-2 gap-2 text-sm">
                                        <span class="text-gray-600">Order ID:</span>
                                        <span class="text-gray-800 font-mono">{order.id.slice(0, 8)}...</span>

                                        <span class="text-gray-600">Quantity:</span>
                                        <span class="text-gray-800">{order.quantity}</span>

                                        <span class="text-gray-600">Filled:</span>
                                        <span class="text-gray-800">{order.filledQuantity}</span>

                                        <span class="text-gray-600">Time:</span>
                                        <span class="text-gray-800">{formatTime(order.timestamp)}</span>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
                {#if buys.length === 0}
                    <div class="text-gray-500 text-center py-4">No buy orders</div>
                {/if}
            </div>
        </div>

        <!-- Sell Orders Tree -->
        <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-semibold text-red-700 mb-4">Sell Orders</h3>
            <div class="space-y-4">
                {#each sells as priceLevel}
                    <div class="border-l-4 border-red-500 pl-4">
                        <div class="font-semibold text-gray-800 mb-2">
                            Price Level: ${formatNumber(priceLevel.price)}
                        </div>
                        <ul class="space-y-3">
                            {#each priceLevel.orders as order}
                                <li class="bg-red-50 rounded-lg p-3 hover:shadow transition-shadow">
                                    <div class="grid grid-cols-2 gap-2 text-sm">
                                        <span class="text-gray-600">Order ID:</span>
                                        <span class="text-gray-800 font-mono">{order.id.slice(0, 8)}...</span>

                                        <span class="text-gray-600">Quantity:</span>
                                        <span class="text-gray-800">{order.quantity}</span>

                                        <span class="text-gray-600">Filled:</span>
                                        <span class="text-gray-800">{order.filledQuantity}</span>

                                        <span class="text-gray-600">Time:</span>
                                        <span class="text-gray-800">{formatTime(order.timestamp)}</span>
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
                {#if sells.length === 0}
                    <div class="text-gray-500 text-center py-4">No sell orders</div>
                {/if}
            </div>
        </div>
    </div>

    <div class="mt-6 text-center text-sm text-gray-600">
        Last Updated: {new Date(timestamp).toLocaleString()}
    </div>
</div>