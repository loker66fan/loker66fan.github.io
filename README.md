# MyIndex

MyIndex is a Vue-powered personal start page built for static hosting. It brings together search, curated shortcuts, weather, music playback, wallpaper switching, and responsive UI refinements in a single homepage without introducing a build pipeline.

## Overview

The project is intended for users who want a customizable browser start page or lightweight personal landing page that can be deployed directly to GitHub Pages, Vercel, Netlify, or any comparable static host. The codebase stays approachable by relying on plain HTML, CSS, and JavaScript files organized around a Vue 3 runtime.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| ![MyIndex desktop preview](./assets/screenshots/home-desktop.png) | ![MyIndex mobile preview](./assets/screenshots/home-mobile.png) |

## Features

- Single-page homepage powered by the Vue 3 global build
- Search overlay with engine switching and custom search engine management
- Quick search presets for common browsing and workflow entry points
- Curated link cards for frequently used websites and tools
- Real-time clock and hitokoto quote display
- Weather modal powered by `wttr.in`
- Music player with configurable NetEase playlist support and local fallback tracks
- Wallpaper switching with persisted user preferences
- Mobile-oriented layout and interaction refinements

## Technology

- Vue 3
- Vanilla JavaScript
- Custom CSS
- Bootstrap grid utilities
- Font Awesome
- APlayer
- iziToast
- js-cookie

## Repository Layout

```text
.
├── index.html
├── 404.html
├── css/
├── js/
├── img/
├── vendor/
├── docs/
├── assets/screenshots/
├── README.md
├── README.zh-CN.md
├── PROJECT_SUMMARY.md
├── CHANGELOG.md
├── VERSION
├── LICENSE
└── vercel.json
```

## Getting Started

No package manager or build tool is required.

Start a local static server from the repository root:

```bash
python3 -m http.server 8080
```

Open the site in a browser:

```text
http://localhost:8080
```

## Deployment

MyIndex is designed for static deployment and can be published to:

- GitHub Pages
- Vercel
- Netlify
- Any standard static hosting provider

## Customization

- Edit page structure and copy in `index.html`
- Update application behavior in `js/app.js`
- Adjust the visual theme in `css/theme.css`
- Replace wallpaper and icon assets in `img/icon/`
- Update PWA metadata in `manifest.json`

## Release Metadata

- Current version: [`VERSION`](./VERSION)
- License: [MIT](./LICENSE)
- Project summary: [`PROJECT_SUMMARY.md`](./PROJECT_SUMMARY.md)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)

## Documentation

- [Chinese README](./README.zh-CN.md)
- [Technical Notes](./docs/技术文档.md)
- [Development Log](./docs/开发日志.md)
- [Learning Log](./docs/学习日志.md)

## Attribution

This repository is released under the [MIT License](./LICENSE).

The current codebase has been substantially customized and extended from earlier personal homepage work inspired by `imsyy/home`. Keep the existing attribution when redistributing substantial portions of the project.
