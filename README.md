# gitviz

A fast, minimal Git GUI built with Tauri and React.

## What it does

- Open any local Git repository via folder picker
- Browse commit history per branch
- See which files changed in each commit, with status (added, modified, deleted, renamed)
- Switch between local branches instantly

## Stack

| | |
|---|---|
| Framework | [Tauri v2](https://tauri.app) |
| Frontend | React + TypeScript + Tailwind CSS |
| Git | [git2](https://github.com/rust-lang/git2-rs) (Rust bindings for libgit2) |

## Getting started

**Prerequisites:** Rust, Node.js, and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

```bash
git clone https://github.com/yourname/gitviz
cd gitviz
npm install
npm run tauri dev
```

## Project structure

```
src/                  # React frontend
  components/
    leftsidebar.tsx   # Repo info + branch list
    middlepart.tsx    # Commit history
    rightsidebar.tsx  # Commit details + changed files
src-tauri/            # Rust backend
  src/lib.rs          # Tauri commands (git2 logic)
```

## Roadmap

- [ ] Stage / unstage files
- [ ] Commit with message
- [ ] Push / Pull
- [ ] Commit graph visualization
- [ ] Diff viewer (line-by-line changes)