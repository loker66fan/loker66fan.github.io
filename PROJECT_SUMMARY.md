# Project Summary

## Name

MyIndex

## One-Line Description

A Vue-powered personal start page for static hosting that combines search, curated links, resilient weather, music playback, wallpapers, and responsive UI into a single homepage.

## Audience

- Personal website owners
- Students or developers who want a customizable browser start page
- Users who prefer static deployment over a full frontend build pipeline

## Core Value

- No build step required
- Easy to deploy to static hosting providers
- Richer interaction than a plain bookmark page
- Straightforward customization through HTML, CSS, and JavaScript files

## Primary Capabilities

- Search engine switching, stable built-in defaults, and custom engine management
- Quick-access link dashboard
- Real-time clock and quote widget
- Weather popup with timeout control, Chinese forecast normalization, and cache reuse
- Embedded music player with configurable NetEase playlist support
- Wallpaper switching with persisted settings
- Mobile-oriented layout refinements

## Deployment Model

Static site deployment via GitHub Pages, Vercel, Netlify, or equivalent hosts.

## Runtime Notes

- Run from a static HTTP server for full feature access; browsers may block weather requests when the page is opened with `file://`
- Search-engine settings are stored in cookies, and recent weather payloads are cached in `localStorage`

## Repository Status

Prepared for public repository publishing with:

- Formal English and Chinese README files
- Explicit version metadata and patch-level release tracking
- Changelog
- MIT license
- Project summary
- Desktop and mobile screenshot assets for README previews
