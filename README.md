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
