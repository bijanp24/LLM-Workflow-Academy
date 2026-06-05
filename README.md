# LLM Academy

A free, static **Learning Management System** that delivers self-paced continuing education on working effectively and safely with large language models.

## Courses

All courses live in the [`LLM-Workflow`](https://github.com/bijanp24/LLM-Workflow)
content repo, consumed here as the `llm-workflow-content` submodule.

| # | Course | Path in content repo |
|---|---|---|
| 1 | Foundations of Executor-Agnostic Workflows | `course.json` (repo root) |
| 2 | Applied Probability for LLM Verification | `applied-probability/` |

## Stack

- **Angular 21** (standalone components, signals)
- **ngx-markdown** (marked + Prism syntax highlighting + Mermaid diagrams)
- Progress persisted to **localStorage** — no backend, fully static.

## How content flows

```
llm-workflow-content/  (git submodule → github.com/bijanp24/LLM-Workflow)
├── catalog.json         ── lists ALL courses (id, title, description, manifest path)
├── course.json          ── lesson manifest for "Foundations" (root course)
├── docs/*.md            ── Foundations lesson content
├── quizzes/*.json       ── Foundations assessments
└── applied-probability/ ── every other course is a self-contained folder
    ├── course.json      ── lesson manifest
    ├── docs/*.md        ── lesson content
    └── quizzes/*.json   ── assessments

The submodule is the single content source. Its files are copied to /content at
build time (angular.json assets), preserving their relative paths.

App loads: /content/catalog.json → per-course manifest → lessons → markdown + quiz
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

## Updating the content

All content lives in the `LLM-Workflow` repo, and the app pins it to a specific
commit via the submodule. To pull the latest content:

```bash
git -C llm-workflow-content pull origin master
git add llm-workflow-content
git commit -m "chore: bump course content"
```

> When a course PR merges in `LLM-Workflow`, this submodule bump is performed
> automatically (see that repo's automation) so the Academy redeploys with the
> new content.

## Authoring a new course

Courses are authored in the [`LLM-Workflow`](https://github.com/bijanp24/LLM-Workflow)
content repo, **not here**. See `COURSES.md` in that repo for the catalog,
manifest, and quiz schemas. In short: add a `your-course-id/` folder with
`course.json`, `docs/*.md`, and `quizzes/*.json`, register it in `catalog.json`,
and open a PR. Once merged, this submodule is bumped and the Academy rebuilds.

### Quiz schema

```json
{
  "id": "unique-quiz-id",
  "title": "Quiz Title",
  "passingScore": 0.7,
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "prompt": "Question text?",
      "options": ["A", "B", "C", "D"],
      "answer": 1,
      "explanation": "Why B is correct."
    },
    {
      "id": "q2",
      "type": "true-false",
      "prompt": "True or false statement.",
      "answer": false,
      "explanation": "Why it is false."
    }
  ]
}
```

## Build

```bash
npm run build        # outputs to dist/llm-workflow-academy/browser
```

The result is fully static and can be hosted on any static host (Netlify, GitHub Pages, etc.). For a sub-path deployment (e.g. GitHub Pages project site), build with `ng build --base-href /llm-workflow-academy/`.
