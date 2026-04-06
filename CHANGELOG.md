# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-04-06

### Added
- **Signal Fault Handling**: Implemented a 10-second connection timeout logic. The player now displays "SIGNAL LOST" and resets the UI if a broadcast fails to reach the device.
- **Performance Virtualization**: Added `getItemLayout` and memoized row components to the Browse and Stations pages, enabling lightning-fast scrolling through thousands of stations.
- **Enhanced Visuals**: Added real-time signal telemetry and enhanced live indicators to the Player screen.

### Changed
- **Architecture Migration**: Migrated from the deprecated `expo-av` to the new high-performance `expo-audio` package for all playback tasks.
- **Modern Layouts**: Replaced deprecated `SafeAreaView` with `react-native-safe-area-context` for better compatibility with modern edge-to-edge displays.
- **Immersive Theming**: Unified the Safe Area background colors across all screens to create a seamless, premium edge-to-edge experience.
- **Taxonomy Refinement**: Renamed 'Global Waves' to 'Global Regions' for better navigation clarity.

### Fixed
- **Navigation Errors**: Resolved warnings regarding missing routes by cleaning up the root navigation stack.
- **Screen Fitting**: Fixed layout issues where the player screen didn't properly fill the vertical space of the display.

---

## [1.0.0] - 2026-04-03
- First stable release of Joy Radio.
- Integrated Radio Browser API for global discovery.
- Spotify-style audio discovery interface.
