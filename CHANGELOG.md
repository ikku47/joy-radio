# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-03

Initial release of Joy Radio.

### Added

- Design-led radio app built with Expo, React Native, and Expo Router
- Intro screen with custom visual identity and animated radio needle
- Country discovery screen with live country data and search
- Station listing screen with live channel data by country
- Player screen with shared playback state, mini-player, and radio-inspired controls
- Shared radio UI system for typography, palette, scale, capsules, icon buttons, and player visuals
- Radio Browser API integration with typed helpers and response formatting
- Audio playback support using Expo AV
- Manrope font integration across the app UI
- Project README with credits, API notes, and legal section

### Android

- Android native project generated with Expo prebuild
- App icon, adaptive icon, favicon, and splash image updated to use the project logo
- Release signing setup added with self-signed keystore support
- `build:android` script added for local release APK generation
- Android package configuration aligned to `com.eq.joyradio`

### Notes

- This is the first public project version
- Radio metadata and stream quality depend on upstream Radio Browser data
