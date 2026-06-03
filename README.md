# LLM-Workflow Academy

A free, static **continuing-education web app** that turns the
[`LLM-Workflow`](https://github.com/bijanp24/LLM-Workflow) documentation into an
interactive course — lessons rendered from markdown, with true/false and multiple-choice
quizzes and locally-saved progress.

It is a **pure viewer**, the way the Angular docs site is separate from Angular itself.
The course content (markdown + quizzes) lives in the `LLM-Workflow` repo, included here
as a **git submodule**. This app only knows how to render a lesson and run a quiz — swap
in any fork of the content repo and you have a different course.

## Stack

- **Angular 21** (standalone components, signals)
- **ngx-markdown** (marked + Prism syntax highlighting + Mermaid diagrams)
- Progress persisted to **localStorage** — no backend, fully static.

## How content flows

```
LLM-Workflow  (submodule at ./llm-workflow-content)
├── course.json        ── the lesson manifest
├── docs/*.md          ── lesson content
└── quizzes/*.json     ── assessments
        │
        ▼  copied to /content at build time (angular.json assets)
this app renders /content/course.json → lessons → markdown + quiz
```

## Getting started

This repo uses a submodule, so clone with `--recurse-submodules`:

```bash
git clone --recurse-submodules https://github.com/bijanp24/llm-workflow-academy.git
cd llm-workflow-academy
npm install
npm start            # ng serve → http://localhost:4200
```

Already cloned without submodules? Run:

```bash
git submodule update --init --recursive
```

## Updating the course content

The content is pinned to a specific commit of `LLM-Workflow`. To pull the latest
lessons/quizzes:

```bash
git -C llm-workflow-content pull origin master
git add llm-workflow-content
git commit -m "chore: bump course content"
```

## Build

```bash
npm run build        # outputs to dist/llm-workflow-academy/browser
```

The result is fully static and can be hosted on any static host (Netlify, GitHub Pages,
etc.). For a sub-path deployment (e.g. GitHub Pages project site), build with
`ng build --base-href /llm-workflow-academy/`.

## Authoring courses

You don't touch this app to write a course — you edit the **content repo**. See
`quizzes/README.md` in [`LLM-Workflow`](https://github.com/bijanp24/LLM-Workflow) for the
`course.json` and quiz JSON schema.
