# tmdb-post

`tmdb-post` is a JavaScript module with TypeScript typings allowing to POST data to **The Movie DB**, a.k.a. **TMDb** (themoviedb.org).

## Motivation
The current official TMDb API only provides a way to GET data.\
This module intends to allow to POST or UPDATE data, using a headless browser.

# Development status and Contribution

This community module is still in an early stage, and **every contribution is welcome**.

## Implemented features

TV Shows:
* Post/update a **Season**.
* Post/update an **Episode**.

Options:
* Chose the entry's **translation** to work on (some TMDb entries have multiple translations).
* Specify your account's **date locale** preference (either `D/M/Y` or `M/D/Y`) when parsing dates.

Browser:
* Open a fresh Chromium browser (headless or not).
* Open a Chromium-based browser with a local user data directory.
* Attach to a locally running Chromium-based browser.

## Backlog

In no particular order:
* Add parallel processing (see branch `feature/parallel`).
* Continue CLI implementation.

# Documentation

## Installation