# MyIndex

A polished personal start page built with Vue 3 and plain static assets.

This project is designed for static deployment and combines search, curated links, weather, music playback, wallpaper switching, and responsive layout refinements in a single homepage. It keeps the deployment model simple while still providing a richer interactive experience than a plain HTML landing page.

## Preview

![MyIndex desktop preview](./assets/screenshots/home-desktop.png)

## Features

- Vue-powered single-page homepage without a build step
- Search overlay with engine switching and custom search engine support
- Quick search presets for common workflows
- Curated link cards for frequently used destinations
- Real-time clock and hitokoto quote panel
- Weather modal powered by `wttr.in`
- Music player with NetEase playlist ID configuration and local fallback tracks
- Wallpaper switching with persisted preferences
- Mobile-friendly layout and interaction adjustments

## Tech Stack

- Vue 3 global build
- Vanilla JavaScript
- Custom CSS
- Bootstrap grid utilities
- Font Awesome
- iziToast
- APlayer
- js-cookie

## Project Structure

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

No build tool is required.

Serve the repository with any static file server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deployment

This repository is suitable for:

- GitHub Pages
- Vercel
- Netlify
- Any static hosting platform

The current repository remote is configured for GitHub Pages publishing via `loker66fan/loker66fan.github.io`.

## Customization

- Edit site content and layout in `index.html`
- Update homepage behavior in `js/app.js`
- Adjust the main visual style in `css/theme.css`
- Replace default wallpaper and icons in `img/icon/`
- Modify PWA metadata in `manifest.json`

## Documentation

- [Chinese README](./README.zh-CN.md)
- [Project Summary](./PROJECT_SUMMARY.md)
- [Changelog](./CHANGELOG.md)
- [Technical Notes](./docs/技术文档.md)
- [Development Log](./docs/开发日志.md)
- [Learning Log](./docs/学习日志.md)

## License

This repository is released under the [MIT License](./LICENSE).

The current project has been substantially customized and extended from earlier personal homepage work inspired by `imsyy/home`. Keep the existing attribution when redistributing substantial portions of the codebase.
