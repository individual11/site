---
title: tsquare
client: Open source
year: 2026
role: Creator
summary: A small language for wireframes, made so AI can write them.
featured: true
stats:
  - 20 of 20 | valid on Sonnet's first try
  - 4x | fewer tokens than JSON
tech:
  - TypeScript
  - Node.js
  - SVG
  - React
  - MCP server
links:
  - tsquare.dev | https://tsquare.dev
  - Playground | https://tsquare.dev/playground
  - GitHub | https://github.com/tsquare-js/tsquare
---

You write one element per line and tsquare draws the board: phones, tablets and desktops side by side, arrows between screens, sticky notes for the open questions. It's named after the drafting tool.

I built it for models to write. Before settling on a syntax I put 20 wireframe requests through Sonnet and Haiku in three formats. The text used about a quarter of the tokens JSON did, and Sonnet got all 20 valid on the first try. Haiku didn't. Errors come back with line numbers so a model can fix its own mistakes. In later tests, one round of fixes got every run to 19 or 20, on both models.

Everything is grayscale with one accent color, on purpose. It's a wireframe.

It's a CLI, a Node library, an MCP server, React components, and plugins for VS Code and Obsidian, and it's in Claude's connector directory. A wireframe can also live in an image URL, so it works anywhere an image does.
