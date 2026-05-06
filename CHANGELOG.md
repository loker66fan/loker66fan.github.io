# Changelog

## 1.0.1 - 2026-05-06

- Replaced remote default search-engine favicons with built-in icon classes to reduce third-party asset dependence
- Normalized persisted search-engine settings so built-in engines restore from stable defaults and custom engines keep only local icon sources
- Reworked the weather popup around the `wttr.in` JSON API with timeout handling, Chinese text normalization, cache reuse, and a fallback retry path
- Added a clearer weather error state for `file://` usage and documented the recommended local-server workflow
- Refreshed wallpaper source notes and synced repository documentation with the current runtime behavior

## 1.0.0 - 2026-05-02

- Rewrote the English README in a more formal repository-facing style
- Added a Chinese companion README for bilingual project documentation
- Added project summary, explicit version metadata, and a public changelog
- Standardized release materials including license, screenshots, and repository metadata
- Updated site metadata to better match the current project identity
