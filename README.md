# gitviz

A minimal Git GUI built with Tauri, React, and TypeScript. Covers the everyday Git workflow without the clutter.

---

## Features

**Repository**
- Open any local repository via folder picker
- Switch between local branches
- Live status bar with feedback on every action
- Error window with raw error output

**Staging**
- Stage / unstage individual files or all at once
- File status indicators — Modified, Added, Deleted, Untracked, Ignored
- Inline file diff view per staged file

**Commits**
- Commit with optional conventional commit prefixes (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`, `perf:`)
- Browse pushed and unpushed commits per branch
- Inspect which files changed in each commit, with full inline diff
- Remove unpushed commits
- Undo the last pushed commit (force push)
- Push individual unpushed commits

**Remote**
- Push and pull with GitHub token authentication
- Push specific commits to remote

---

## Stack

- **Frontend** — React, TypeScript, Tailwind CSS v4, Zustand
- **Backend** — Rust, Tauri, git2

---

## Download

Head to [Releases](../../releases) and grab the latest installer for your platform.

---

## Usage

1. Click the repo button (top left) to open a local repository
2. Switch branches using the branch dropdown
3. In the **Staging** view - stage files, write a commit message, and commit
4. In the **History** view - browse commits, inspect diffs, push or undo commits
5. Push and pull via the buttons

> Push and pull require a GitHub personal access token with `repo` scope.

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

- Branch creation and deletion
- Lazy commit file loading with per-commit cache
- Settings panel (configurable commit load limit, etc.)
- Error suggestions

---

## License

MIT