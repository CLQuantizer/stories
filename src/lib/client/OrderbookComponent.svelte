<script lang="ts">
    import type {OrderBook, PriceLevel} from "$lib/client/schemas";

    export let data: OrderBook;

    // Helper function to aggregate quantities at each price level
    function aggregateOrdersByPrice(orders: PriceLevel[]) {
        return orders.map(priceLevel => ({
            price: priceLevel.price,
            totalQuantity: priceLevel.orders.reduce(
                (sum, order) => sum + (order.quantity - order.filledQuantity),
                0
            ),
            orderCount: priceLevel.orders.length
        }));
    }

    $: aggregatedSellOrders = aggregateOrdersByPrice(data.sellOrders);
    $: aggregatedBuyOrders = aggregateOrdersByPrice(data.buyOrders);

    const formatNumber = (num: number): string => num.toFixed(2);
    const formatDate = (date: string): string => new Date(date).toLocaleString();
</script>

<div class="max-w-7xl mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Orderbook</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Buy Orders -->
        <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Buy Orders</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                    <tr class="bg-gray-50">
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Price</th>
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Quantity</th>
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Orders</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#if aggregatedBuyOrders.length === 0}
                        <tr>
                            <td colspan="3" class="px-4 py-2 text-center text-gray-500">No buy orders</td>
                        </tr>
                    {/if}
                    {#each aggregatedBuyOrders as level}
                        <tr class="border-b border-gray-100">
                            <td class="px-4 py-2 text-right font-medium text-green-600">
                                {formatNumber(level.price)}
                            </td>
                            <td class="px-4 py-2 text-right text-gray-700">
                                {formatNumber(level.totalQuantity)}
                            </td>
                            <td class="px-4 py-2 text-right text-gray-700">
                                {level.orderCount}
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Sell Orders -->
        <div class="bg-white rounded-lg shadow p-4">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Sell Orders</h3>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                    <tr class="bg-gray-50">
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Price</th>
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Quantity</th>
                        <th class="px-4 py-2 text-right text-sm font-semibold text-gray-600">Orders</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#if aggregatedSellOrders.length === 0}
                        <tr>
                            <td colspan="3" class="px-4 py-2 text-center text-gray-500">No sell orders</td>
                        </tr>
                    {/if}
                    {#each aggregatedSellOrders as level}
                        <tr class="border-b border-gray-100">
                            <td class="px-4 py-2 text-right font-medium text-red-600">
                                {formatNumber(level.price)}
                            </td>
                            <td class="px-4 py-2 text-right text-gray-700">
                                {formatNumber(level.totalQuantity)}
                            </td>
                            <td class="px-4 py-2 text-right text-gray-700">
                                {level.orderCount}
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="mt-6 text-center text-sm text-gray-600">
        <p class="mb-1">Total Buy Orders: {data.buys}</p>
        <p class="mb-1">Total Sell Orders: {data.sells}</p>
        <p>Last Updated: {data.timestamp}</p>
    </div>
</div>