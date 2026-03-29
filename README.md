# Perucho's App

React Native + Expo app for a restaurant ordering flow connected to Supabase.

## Current scope

- branded intro with Perucho's logo
- language selection before entering the menu
- tablet-first split layout with menu on the left and live cart on the right
- category tabs, search, and product grid
- product configurator with quantity, note, and basic options
- checkout and order history
- Supabase-backed catalog and orders
- JPY pricing

## Stack

- Expo
- React Native
- NativeWind
- React Navigation
- Zustand
- Supabase
- FlashList

## Run locally

```bash
npm install
npx expo start --ios
```

## Environment

Create a local `.env` with:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Repository

GitHub: <https://github.com/zesaru/peruchos-app>

## Roadmap

### Next

- refine the menu screen layout and spacing for tablet ordering
- translate all configurator option values across Spanish, English, and Japanese
- improve cart feedback and product-to-cart animation

### Soon

- load real configurable options per product from Supabase
- improve order status badges and kitchen flow states
- add stronger image handling and fallbacks for missing assets

### Later

- move from local mock behavior to a fuller Supabase-backed order lifecycle
- add analytics, staff tooling, and production release setup
