# Shared Order Contract

## Purpose

This document defines the shared order contract used by the React Native app, the web app, and the current Supabase schema.

The goal is to keep both clients compatible without breaking:
- `orders.products`
- kitchen printing
- cashier/payment flows
- historical orders already stored in production

## Current production source of truth

Today, the production-safe contract is the one already used by the web app and stored in Supabase:

- `orders.products` is a JSON array
- each entry in `orders.products` represents one order line
- the mobile app must write that same array shape
- both apps may read older or richer payloads defensively, but must not write a different shape to production without a coordinated migration

## Shared order payload

`orders.products` must be an array:

```json
[
  {
    "id": 163,
    "name": "Lomo Saltado",
    "nameEs": "Lomo Saltado",
    "nameEn": "Lomo Saltado",
    "nameJa": "ロモ・サルタード",
    "quantity": 1,
    "price": 3200,
    "notes": "sin cebolla",
    "selectedOptions": ["Spice: Mild"]
  }
]
```

## Required line fields

Every order line should include:

- `id`
- `name`
- `quantity`
- `price`

## Optional line fields

These are allowed and should be tolerated by both apps even if not fully rendered everywhere:

- `nameEs`
- `nameEn`
- `nameJa`
- `notes`
- `selectedOptions`
- `image`
- `category`
- `macroCategory`
- `prepTime`

## Fields that are not part of `orders.products`

These must not be treated as part of the shared persisted order-line contract:

- `customerName`
- `orderType`
- `draft`

Current rule:

- mobile may use these locally for the active checkout flow
- web must not be forced to read them from `orders.products`
- if these values need to be persisted for both apps, they should move to dedicated database fields or a separate versioned metadata field

`tableNumber` is UI-facing data and should be resolved from `table_id` and the related table record when possible.

## Currency rule

All prices must use the same convention across:

- `dishes.price`
- `orders.total`
- app UI totals
- cashier/kitchen calculations

Rule:

- use yen integer amounts
- do not mix scales like `8`, `800`, and `8.00` to represent different meanings

Examples:

- `800`
- `1600`
- `3200`

## Status rule

The apps should normalize to the same operational statuses:

- `pending`
- `preparing`
- `ready`
- `delivered`

If a client receives a different database value, it should map it explicitly instead of guessing.

## Image rule

Both apps should follow the same image resolution order:

1. use `image` when it is already a public URL
2. otherwise build a public URL from `image_path`
3. otherwise render a stable `No Image` placeholder

## Compatibility rules

Until a coordinated migration exists:

- web writes `orders.products` as an array
- mobile writes `orders.products` as an array
- web should continue reading the array format
- mobile may read both:
  - legacy array format
  - richer object-shaped formats from older experiments or fallback paths

Important:

- do not change the production write contract for `orders.products` in one app only
- do not introduce `{ draft, items }` as the production write shape

## Client responsibilities

### Web app

- validates `products` as a non-empty array on order creation
- treats `products` as the persisted shared contract
- should tolerate optional `notes` and `selectedOptions`

### Mobile app

- may keep richer UI state locally for cart/configurator/history
- must serialize new orders back to the shared array contract before insert
- must not assume `customerName` or `orderType` can be recovered from production history unless they are persisted elsewhere

## Future migration rule

If the team wants a richer shared contract later, do not replace `orders.products` in place without coordination.

Do this instead:

1. define the target versioned contract
2. update web and mobile readers first
3. update writers in a controlled rollout
4. migrate historical data only if needed
5. remove legacy compatibility only after both apps are aligned

Related issue:

- `peruchos-app#1` Define future unified contract for `orders.products`
