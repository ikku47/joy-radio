# Joy Radio

Joy Radio is a design-forward online radio app built with Expo and React Native. It combines a minimal editorial-style interface with live station discovery, country browsing, and an in-app player experience.

## Highlights

- Full-screen mobile radio experience with custom intro, countries, stations, and player screens
- Live radio discovery powered by the Radio Browser directory
- Searchable country and station flows
- Shared audio player context for playback and mini-player state
- Custom typography and motion built around the app's visual system

## Tech Stack

- Expo
- React Native
- Expo Router
- TypeScript
- React Native Reanimated
- Expo AV

## API

This app uses the [Radio Browser API](https://www.radio-browser.info/).

Current base endpoint:

```txt
https://de1.api.radio-browser.info/json
```

Primary data used by the app includes:

- `/countries`
- `/stations`
- `/stations/bycountrycodeexact/:code`

## Project Structure

```txt
app/
  index.tsx        Intro screen
  countries.tsx    Country listing and search
  stations.tsx     Station listing and search
  player.tsx       Playback screen

components/
  radio-ui.tsx     Shared visual system and radio UI primitives

lib/
  radio.ts         Radio Browser API helpers
  player-context.tsx
```

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Start the Expo dev server

```bash
npx expo start
```

3. Run the app in your preferred environment

- iOS simulator
- Android emulator
- Expo Go
- Web

## Scripts

```bash
npm run start
npm run ios
npm run android
npm run web
npm run lint
```

## Design Credits

Visual direction for this project was inspired by [Tamarashvili](https://dribbble.com/Tamarashvili) and the Dribbble shot [UI Exploration. Online Radio](https://dribbble.com/shots/24479926-UI-Exploration-Online-Radio).

Thanks for the original exploration and inspiration behind the interface direction.

## Legal

- This project is an independent implementation and is not affiliated with or endorsed by Dribbble, Tamarashvili, or Radio Browser.
- Station names, stream URLs, logos, and metadata are provided by third-party radio directory data sources through Radio Browser.
- All trademarks, station brands, logos, and media rights belong to their respective owners.
- This repository is intended for educational, experimental, and product-development purposes.
- If you use this project commercially, review the licenses and terms of all third-party APIs, assets, fonts, and dependencies you rely on.

## Notes

- Radio availability and metadata quality depend on upstream Radio Browser data.
- Some streams may be unavailable, geo-restricted, slow, or incorrectly tagged.
- Playback behavior can vary by device, platform, and stream format.
