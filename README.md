# gitviz

A minimal Git GUI built with Tauri, React, and TypeScript. Designed to cover the everyday Git workflow without the clutter.

---

## Features

- Open any local repository via folder picker
- Stage / unstage individual files or all at once
- Commit with optional conventional commit prefixes (`feat:`, `fix:`, `chore:`, ...)
- Push and pull with GitHub token authentication
- Browse pushed and unpushed commits per branch
- See which files changed in each commit
- Undo the last pushed commit (force push)
- Switch between branches
- Status bar with live feedback
- Error window with raw error output

---

## Stack

- **Frontend** — React, TypeScript, Tailwind CSS v4, Zustand
- **Backend** — Rust, Tauri, git2

---

## Download

Head to [Releases](../../releases) and download the latest installer for your platform.

---

## Usage

1. Click the folder icon in the top bar to open a repository
2. Enter your GitHub username and personal access token in the credential fields
3. Stage files from the working tree, write a commit message, and commit
4. Push, pull, or manage commits from the commit panels

> A GitHub personal access token with `repo` scope is required for push and pull.

---

## Build from source

```bash
git clone https://github.com/yourusername/gitviz
cd gitviz
npm install
npm run tauri build
```

Requires [Rust](https://rustup.rs) and [Node.js](https://nodejs.org).

---

## Planned

- Line-level diff view
- Error suggestions
- Create / delete branches

---

## License

MIT