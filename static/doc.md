# Limit Order Book Implementation Documentation

## Overview
This implementation represents a limit order book system built for the Deno JavaScript runtime. It maintains two separate binary search trees for buy and sell orders, and implements a price-time priority matching engine.

## Runtime Environment
- Built for Deno JavaScript runtime
- Runs on a single-threaded event loop
- Uses Deno's standard library data structures (`@std/data-structures/binary-search-tree`)

## Core Components

### Data Structures

#### Order Books
```typescript
export const BuyTree = new BinarySearchTree((a:PriceLevel, b) => a.price - b.price);
export const SellTree = new BinarySearchTree((a:PriceLevel, b) => a.price - b.price);
```
- Two separate binary search trees maintain buy and sell orders
- Buy orders are sorted by price in ascending order
- Sell orders are sorted by price in ascending order
- Each node in the tree represents a price level containing multiple orders

#### Price Levels
Each price level in the order book contains:
- `price`: The price point for this level
- `orders`: Array of orders at this price point, sorted by time priority

#### Orders
Each order contains:
- `id`: Unique identifier
- `side`: BUY or SELL
- `price`: Limit price
- `quantity`: Total quantity
- `filledQuantity`: Amount already executed
- `status`: Current order status (NEW, PARTIALLY_FILLED, FILLED)

#### Trades
```typescript
export const Trades: Trade[] = [];
```
Maintains a record of all executed trades, each containing:
- `price`: Execution price
- `quantity`: Executed quantity
- `timestamp`: Execution time using `Date.now()`
- `buyOrderId`: ID of the buy order
- `sellOrderId`: ID of the sell order

## Core Functions

### `processOrder(order: Order)`
Main entry point for processing new orders:
1. Attempts to match the incoming order against existing orders
2. If not fully filled, adds remaining quantity to the order book

### `matchOrder(order: Order, oppositeBook: BinarySearchTree<PriceLevel>)`
Recursive matching algorithm that:
1. Finds the best matching price level in the opposite book
2. Checks if price crosses (buy price ≥ sell price)
3. Matches orders at the current price level following time priority
4. Records trades for matched quantities
5. Updates order statuses and filled quantities
6. Continues matching at next price level if necessary

### `addOrderToBook(order: Order, book: BinarySearchTree<PriceLevel>)`
Adds an order to the specified book:
1. Finds or creates appropriate price level
2. Adds order to the price level's order array
3. Maintains time priority within price level

## Matching Process Details

1. **Price-Time Priority**
    - Orders are matched at the best available price
    - Within each price level, orders are matched in time priority (FIFO)

2. **Crossing Logic**
    - Buy orders match if order price ≥ best sell price
    - Sell orders match if order price ≤ best buy price

3. **Partial Fills**
    - Orders can be partially filled
    - Remaining quantity stays in the book
    - Status updated to PARTIALLY_FILLED

4. **Full Fills**
    - Orders filled completely are marked as FILLED
    - Removed from the order book
    - Empty price levels are pruned

## Usage Example

```typescript
// Create a buy order
const buyOrder = {
    id: "order1",
    side: Side.BUY,
    price: 100,
    quantity: 10,
    filledQuantity: 0,
    status: OrderStatus.NEW
};

// Process the order
processOrder(buyOrder);
```

## Performance Characteristics

- Order Book Insertion: O(log n)
- Order Book Removal: O(log n)
- Best Price Lookup: O(1)
- Price Level Lookup: O(log n)
- Order Matching: O(m * log n)
    - where n is the number of price levels
    - where m is the number of orders at a price level