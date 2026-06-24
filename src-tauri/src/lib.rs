use git2::{ IndexAddOption, Repository};
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
    pub is_ignored: bool,
    pub is_staged: bool,
}

#[tauri::command]
fn git_push(path: String, branch: String, username: String, token: String) -> Result<(), String> {
    let output = std::process::Command::new("git")
        .args(["push", "origin", &branch])
        .env("GIT_USERNAME", &username)
        .env("GIT_PASSWORD", &token)
        .env("GIT_ASKPASS", "echo")
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn git_push_commit(path: String, branch: String, username: String, token: String, commit_hash: String) -> Result<(), String>{
    let refspec = format!("{}:refs/heads/{}", commit_hash, branch);

    let push = std::process::Command::new("git")
        .args(["push", "origin", &refspec])
        .env("GIT_USERNAME", &username)
        .env("GIT_PASSWORD", &token)
        .env("GIT_ASKPASS", "echo")
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if !push.status.success() {
        return Err(String::from_utf8_lossy(&push.stderr).to_string());
    }

    let fetch = std::process::Command::new("git")
        .args(["fetch", "origin"])
        .env("GIT_USERNAME", &username)
        .env("GIT_PASSWORD", &token)
        .env("GIT_ASKPASS", "echo")
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if fetch.status.success() { Ok(()) } else { Err(String::from_utf8_lossy(&fetch.stderr).to_string()) }
}

#[tauri::command]
fn get_entrys(path: String) -> Result<Vec<FileInfo>, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let statuses = repo.statuses(None).map_err(|e| e.message().to_string())?;
    let mut entrys = Vec::new();
    for entry in statuses.iter(){
        let file_path = entry.path().unwrap_or("").to_string();
        let status = entry.status();
        let status = if status.contains(git2::Status::INDEX_NEW) || status.contains(git2::Status::INDEX_MODIFIED) {
            "STAGED"
        } else if status.contains(git2::Status::WT_NEW) {
            "UNTRACKED"
        } else if status.contains(git2::Status::WT_MODIFIED) {
            "MODIFIED"
        } else if status.contains(git2::Status::INDEX_DELETED) || status.contains(git2::Status::WT_DELETED) {
            "DELETED"
        } else if is_ignored(&path, &file_path).unwrap_or(false){
            "IGNORED"
        } else {
            "UNKNOWN"
        }.to_string();
        let ignored = is_ignored(&path, &file_path).unwrap_or(false);
        entrys.push(FileInfo{
            path: file_path,
            status: status.clone(),
            is_ignored: ignored,
            is_staged: status == "STAGED",
        })
    }
    Ok(entrys)
}

#[tauri::command]
fn is_ignored(path: &str, file_path: &str) -> Result<bool, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let ignored = repo.is_path_ignored(&file_path).map_err(|e| e.message().to_string())?;
    Ok(ignored)
}

#[tauri::command]
fn add_all(path: &str) -> Result<(), String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let mut index = repo.index().map_err(|e| e.message().to_string())?;
    index.add_all(["*"], IndexAddOption::DEFAULT, None).map_err(|e| e.message().to_string())?;
    index.write().map_err(|e| e.message().to_string())?;
    Ok(())
}

#[tauri::command]
fn unstage_all(path: &str) -> Result<(), String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let head = repo.head().map_err(|e| e.message().to_string())?.peel_to_commit().map_err(|e| e.message().to_string())?;
    repo.reset_default(Some(head.as_object()), ["*"]).map_err(|e| e.message().to_string())?;
    Ok(())
}

#[tauri::command]
fn git_add(path: String, file_path: String) -> Result<(), String> {
    let output = std::process::Command::new("git")
        .args(["add", &file_path])
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
#[tauri::command]
fn git_remove(path: String, file_path: String) -> Result<(), String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let head_obj = repo.head().ok().and_then(|h| h.peel_to_commit().ok());
    repo.reset_default(head_obj.as_ref().map(|c| c.as_object()), [&file_path]).map_err(|e| e.message().to_string())?;
    Ok(())
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
fn remove_unpushed_commit(path: String, hash: String) -> Result<(), String> {
    let output = std::process::Command::new("git")
        .args(["reset", &format!("{}~1", hash)])
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn git_pull(path: String, branch: String, username: String, token: String) -> Result<(), String> {
    let output = std::process::Command::new("git")
        .args(["pull", "origin", &branch])
        .env("GIT_USERNAME", &username)
        .env("GIT_PASSWORD", &token)
        .env("GIT_ASKPASS", "echo")
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn undo_pushed_commit(path: String, branch: String, username: String, token: String) -> Result<(), String> {
    let reset = std::process::Command::new("git")
        .args(["reset", "--soft", "HEAD~1"])
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;
    
    if !reset.status.success() {
        return Err(String::from_utf8_lossy(&reset.stderr).to_string());
    }

    let push = std::process::Command::new("git")
        .args(["push", "--force", "origin", &branch])
        .env("GIT_USERNAME", &username)
        .env("GIT_PASSWORD", &token)
        .env("GIT_ASKPASS", "echo")
        .current_dir(&path)
        .output()
        .map_err(|e| e.to_string())?;

    if push.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&push.stderr).to_string())
    }
}

#[tauri::command]
fn get_pushed_commits(path: String, branch: String) -> Result<Vec<CommitInfo>, String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let remote_ref = format!("origin/{}", branch);
    let remote = repo.revparse_single(&remote_ref).map_err(|e| e.message().to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.message().to_string())?;
    revwalk.push(remote.id()).map_err(|e| e.message().to_string())?;

    let commits = revwalk
        .take(50)
        .filter_map(|oid| {
            let oid = oid.ok()?;
            let hash = oid.to_string();
            let commit = repo.find_commit(oid).ok()?;
            let author = commit.author();
            let author_name = author.name().unwrap_or("Unknown").to_string();
            let summary = commit.summary_bytes().and_then(|b| std::str::from_utf8(b).ok()).unwrap_or("").to_string();
            Some(CommitInfo { hash, message: summary, author: author_name, time: commit.time().seconds() })
        })
        .collect();

    Ok(commits)
}

#[tauri::command]
fn get_unpushed_commits(path: String, branch: String) -> Result<Vec<CommitInfo>, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let local = repo.revparse_single("HEAD").map_err(|e| e.message().to_string())?.peel_to_commit().map_err(|e| e.message().to_string())?;
    let remote_ref = format!("origin/{}", branch);
    let remote = repo.revparse_single(&remote_ref).map_err(|e| e.message().to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.message().to_string())?;
    revwalk.push(local.id()).map_err(|e| e.message().to_string())?;
    revwalk.hide(remote.id()).map_err(|e| e.message().to_string())?;
    let commits = revwalk
        .filter_map(|oid| {
            let oid = oid.ok()?;
            let hash = oid.to_string();
            let commit = repo.find_commit(oid).ok()?;
            let author = commit.author();
            let author_name = author.name().unwrap_or("Unknown").to_string();
            let summary = commit.summary_bytes().and_then(|b| std::str::from_utf8(b).ok()).unwrap_or("").to_string();
            Some(CommitInfo { hash, message: summary, author: author_name, time: commit.time().seconds() })
        })
        .collect();
    Ok(commits)
}

#[tauri::command]
fn make_commit(path: String, message: String) -> Result<(), String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let config = repo.config().map_err(|e| e.message().to_string())?;
    let name = config.get_string("user.name").map_err(|e| e.message().to_string())?;
    let email = config.get_string("user.email").map_err(|e| e.message().to_string())?;
    let sig = git2::Signature::now(&name, &email).map_err(|e| e.message().to_string())?;
    let mut index = repo.index().map_err(|e| e.message().to_string())?;
    let tree_id = index.write_tree().map_err(|e| e.message().to_string())?;
    let tree = repo.find_tree(tree_id).map_err(|e| e.message().to_string())?;
    let parent = repo.head().map_err(|e| e.message().to_string())?.peel_to_commit().map_err(|e| e.message().to_string())?;
    repo.commit(Some("HEAD"), &sig, &sig, &message, &tree, &[&parent]).map_err(|e| e.message().to_string())?;
    Ok(())
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
fn get_commit_files(path: String, hash: String) -> Result<Vec<FileInfo>, String>{
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    let oid = git2::Oid::from_str(&hash).map_err(|e| e.message().to_string())?;
    let commit = repo.find_commit(oid).map_err(|e| e.message().to_string())?;

    let tree = commit.tree().map_err(|e| e.message().to_string())?;
    let parent_tree = commit.parent(0).ok().and_then(|p| p.tree().ok());

    let diff = repo.diff_tree_to_tree(parent_tree.as_ref(), Some(&tree), None).map_err(|e| e.message().to_string())?;

    let mut files = Vec::new();
    diff.foreach(&mut |delta, _|{
        if let Some(file_path) = delta.new_file().path() {
            let ignored = repo.is_path_ignored(file_path).unwrap_or(false);
            files.push(FileInfo {
                path: file_path.to_string_lossy().to_string(),
                status: match delta.status() {
                    git2::Delta::Added => "ADDED",
                    git2::Delta::Deleted => "DELETED",
                    git2::Delta::Modified => "MODIFIED",
                    _ => "UNKNOWN",
                }.to_string(),
                is_ignored: ignored,
                is_staged: false
            });
        }
        true
    }, None, None, None).map_err(|e| e.message().to_string())?;

    Ok(files)
}

#[tauri::command]
fn get_commit_file_diff(path: String, file_path: String, hash: String) -> Result<String, String> {
    let repo = Repository::open(&path).map_err(|e| e.message().to_string())?;
    
    let oid = git2::Oid::from_str(&hash).map_err(|e| e.message().to_string())?;
    let commit = repo.find_commit(oid).map_err(|e| e.message().to_string())?;
    let tree = commit.tree().map_err(|e| e.message().to_string())?;
    let parent_tree = commit.parent(0).ok().and_then(|p| p.tree().ok());

    let diff = repo
        .diff_tree_to_tree(parent_tree.as_ref(), Some(&tree), None)
        .map_err(|e| e.message().to_string())?;

    let mut result = String::new();

    diff.foreach(
        &mut |_, _| true,
        None,
        None,
        Some(&mut |delta, _, line| {
            let delta_path = delta
                .new_file()
                .path()
                .or_else(|| delta.old_file().path())
                .and_then(|p| p.to_str())
                .unwrap_or("");

            if delta_path != file_path {
                return true;
            }

            if matches!(line.origin(), '+' | '-' | ' ') {
                result.push(line.origin());
                result.push_str(std::str::from_utf8(line.content()).unwrap_or(""));
            }
            true
        }),
    )
    .map_err(|e| e.message().to_string())?;

    Ok(result)
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
        .invoke_handler(tauri::generate_handler![
            greet, get_commits, get_commit_files, 
            get_branches, get_commits_with_branch, 
            get_entrys, git_add, git_remove, 
            is_ignored, make_commit, get_unpushed_commits,
            git_push, git_push_commit, get_pushed_commits,
            remove_unpushed_commit, undo_pushed_commit,
            git_pull, add_all, unstage_all, get_commit_file_diff
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
