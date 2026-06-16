use git2::Repository;
use serde::Serialize;

#[derive(Serialize)]
pub struct CommitInfo{
    pub hash: String,
    pub message: String,
    pub author: String,
    pub time: i64,
}

#[derive(Serialize)]
pub struct FileInfo{
    pub path: String,
    pub status: String,
}

#[tauri::command]
fn get_entrys(path: String) -> Result<Vec<FileInfo>, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let statuses = repo.statuses(None).map_err(|e| e.message().to_string())?;
    let mut entrys = Vec::new();
    for entry in statuses.iter(){
        let path = entry.path().unwrap_or("").to_string();
        let status = entry.status();
        let status = if status.contains(git2::Status::INDEX_NEW) || status.contains(git2::Status::INDEX_MODIFIED) {
            "STAGED"
        } else if status.contains(git2::Status::WT_NEW) {
            "UNTRACKED"
        } else {
            "MODIFIED"
        }.to_string();
        entrys.push(FileInfo{
            path: path,
            status: status
        })
    }
    Ok(entrys)
}

#[tauri::command]
fn get_branches(path: String) -> Result<Vec<String>, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let branches = repo.branches(Some(git2::BranchType::Local)).map_err(|e| e.message().to_string())?;
    let mut names: Vec<String> = Vec::new();
    for branch in branches {
        let (branch, _) = branch.map_err(|e| e.message().to_string())?;
        if let Some(name) = branch.name().ok().flatten() {
            names.push(name.to_string());
        }
    }
    Ok(names)
}

#[tauri::command]
fn get_commits_with_branch(path: String, branch: String) -> Result<Vec<CommitInfo>, String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let branch = repo.find_branch(&branch, git2::BranchType::Local).map_err(|e| e.message().to_string())?;
    let commit = branch.get().peel_to_commit().map_err(|e| e.message().to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.message().to_string())?;
    revwalk.push(commit.id()).map_err(|e| e.message().to_string())?;

    let commits = revwalk
        .take(50)
        .filter_map(|oid| {
            let oid = oid.ok()?;
            let hash = oid.to_string();
            let commit = repo.find_commit(oid).ok()?;
            let author = commit.author();
            let author_name = author.name().unwrap_or("Unknown").to_string();
            let summary = commit.summary_bytes().and_then(|b| std::str::from_utf8(b).ok()).unwrap_or("").to_string();
            Some(CommitInfo {
                hash: hash,
                message: summary,
                author: author_name,
                time: commit.time().seconds(),
            })
        })
        .collect();

    Ok(commits)
}

#[tauri::command]
fn get_commits(path: String) -> Result<Vec<CommitInfo>, String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.message().to_string())?;
    revwalk.push_head().map_err(|e| e.message().to_string())?;

    let commits = revwalk
        .take(50)
        .filter_map(|oid| {
            let oid = oid.ok()?;
            let hash = oid.to_string();
            let commit = repo.find_commit(oid).ok()?;
            let author = commit.author();
            let author_name = author.name().unwrap_or("Unknown").to_string();
            let summary = commit.summary_bytes().and_then(|b| std::str::from_utf8(b).ok()).unwrap_or("").to_string();
            Some(CommitInfo {
                hash: hash,
                message: summary,
                author: author_name,
                time: commit.time().seconds(),
            })
        })
        .collect();

    Ok(commits)
}

#[tauri::command]
fn get_commit_files(repo_path: String, hash: String) -> Result<Vec<FileInfo>, String>{
    let repo = Repository::open(&repo_path).map_err(|e| e.message().to_string())?;
    let oid = git2::Oid::from_str(&hash).map_err(|e| e.message().to_string())?;
    let commit = repo.find_commit(oid).map_err(|e| e.message().to_string())?;

    let tree = commit.tree().map_err(|e| e.message().to_string())?;
    let parent_tree = commit.parent(0).ok().and_then(|p| p.tree().ok());

    let diff = repo.diff_tree_to_tree(parent_tree.as_ref(), Some(&tree), None).map_err(|e| e.message().to_string())?;

    let mut files = Vec::new();
    diff.foreach(&mut |delta, _|{
        if let Some(path) = delta.new_file().path() {
            files.push(FileInfo {
                path: path.to_string_lossy().to_string(),
                status: match delta.status() {
                    git2::Delta::Added => "ADDED",
                    git2::Delta::Deleted => "DELETED",
                    git2::Delta::Modified => "MODIFIED",
                    _ => "UNKNOWN",
                }.to_string(),
            });
        }
        true
    }, None, None, None).map_err(|e| e.message().to_string())?;

    Ok(files)
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, get_commits, get_commit_files, get_branches, get_commits_with_branch, get_entrys])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
