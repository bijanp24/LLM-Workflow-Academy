# LLM Academy

A free, static **Learning Management System** that delivers self-paced continuing education on working effectively and safely with large language models.

## Courses

| # | Course | Source |
|---|---|---|
| 1 | Foundations of Executor-Agnostic Workflows | `llm-workflow-content` submodule |
| 2 | Applied Probability for LLM Verification | `local-content/` in this repo |

## Stack

- **Angular 21** (standalone components, signals)
- **ngx-markdown** (marked + Prism syntax highlighting + Mermaid diagrams)
- Progress persisted to **localStorage** — no backend, fully static.

## How content flows

```
llm-workflow-content/  (git submodule → github.com/bijanp24/LLM-Workflow)
├── course.json          ── lesson manifest for "Foundations"
├── docs/*.md            ── lesson content
└── quizzes/*.json       ── assessments

local-content/           ── authored directly in this repo
├── catalog.json         ── lists ALL courses (id, title, description, manifest path)
└── applied-probability/
    ├── course.json      ── lesson manifest for "Applied Probability"
    ├── docs/*.md        ── lesson content
    └── quizzes/*.json   ── assessments

Both folders are copied to /content at build time (angular.json assets),
preserving their relative paths.

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

## Updating the submodule content

The "Foundations" course is pinned to a specific commit of `LLM-Workflow`. To pull the latest:

```bash
git -C llm-workflow-content pull origin master
git add llm-workflow-content
git commit -m "chore: bump course content"
```

## Authoring a new course

1. **Add a folder** under `local-content/your-course-id/` with:
   - `course.json` — lesson manifest (same schema as `llm-workflow-content/course.json`)
   - `docs/*.md` — lesson markdown files
   - `quizzes/*.json` — quiz JSON files (see `local-content/applied-probability/quizzes/` for examples)

2. **Register it** in `local-content/catalog.json`:
   ```json
   {
     "id": "your-course-id",
     "title": "Your Course Title",
     "description": "Short description shown on the catalog page.",
     "manifest": "your-course-id/course.json"
   }
   ```

3. That's it. The build copies everything into `/content` automatically.

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
