---
name: fix-pr
description: >
  Autonomously fixes an open Pull Request by addressing unresolved review comments (inline and general),
  applying GitHub suggested changes, and resolving CI failures. Uses the `gh` CLI to interact with GitHub.
  Use this skill when the user asks to "fix the PR", "address review comments", or "fix CI failures on the PR".
---

# Fix Pull Request

This skill works through an open PR on the current branch, addressing all unresolved review comments and CI failures.
Each fix is committed individually, and the user is asked for confirmation before pushing.

## When to Use This Skill

Use this skill when you need to:
- Address reviewer comments on a PR (inline and general)
- Apply GitHub suggested changes from reviewers
- Fix failing CI jobs on a PR
- Clean up a PR so it is ready to merge

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status`)
- A git repository with an open PR on the current branch
- The working tree should be clean before starting (no uncommitted changes)

## Workflow

Follow these steps in order. Do not skip a step unless its condition says to.

### Step 0: Validate Environment

1. Run `gh auth status` to confirm the user is authenticated. If not, abort and instruct the user to run `gh auth login`.
2. Run `gh pr view --json number,title,url,headRefName` on the current branch.
   - If no open PR is found, abort with a clear message: _"No open PR found for the current branch. Please open a PR first."_
   - Store the PR number for all subsequent API calls.
3. Confirm the working tree is clean (`git status --porcelain`). If there are uncommitted changes, warn the user and ask if they want to continue or stash first.

### Step 1: Process Inline Review Thread Comments

1. Fetch all review threads:
   ```
   gh api graphql -f query='
     query($owner:String!, $repo:String!, $pr:Int!) {
       repository(owner:$owner, name:$repo) {
         pullRequest(number:$pr) {
           reviewThreads(first:50) {
             nodes {
               id
               isResolved
               isOutdated
               comments(first:10) {
                 nodes {
                   id
                   body
                   path
                   line
                   author { login }
                 }
               }
             }
           }
         }
       }
     }
   ' -F owner=OWNER -F repo=REPO -F pr=PR_NUMBER
   ```
2. Filter to threads where `isResolved: false` and `isOutdated: false`.
3. For each unresolved thread:

   **If it is a GitHub suggested change** (body starts with ` ```suggestion`):
   - Extract the suggested diff and apply it to the file.
   - Commit: `fix: apply suggestion from @<reviewer>`
   - Reply to the thread: _"Applied the suggested change."_
   - Resolve the thread via the GraphQL `resolveReviewThread` mutation.

   **If it is an inline code comment**:
   - Read the referenced file and line(s).
   - Attempt to fix the code as described in the comment.
   - If you are confident in the fix: commit with `fix: address review comment from @<reviewer> — <one-line description>`, reply describing what was changed, then resolve the thread.
   - If you are **not confident** how to address it: pause and use `ask_user` to ask the human operator how to proceed. Resume once answered.

   **If it is a question or discussion** (no code change implied):
   - Reply acknowledging the comment.
   - Ask the user: _"This comment from @<reviewer> appears to be a question/discussion rather than a code change request. Should I resolve this thread?"_

### Step 2: Process General PR Comments

1. Fetch all top-level PR comments AND review summaries (review body, not inline threads):
   ```
   gh pr view PR_NUMBER --json comments,reviews
   ```
2. Review **all** comments and review bodies — including those from automated bots (e.g., `copilot-pull-request-reviewer`, `github-actions`, `sentry`, `dependabot`). Do **not** skip a comment just because it comes from a bot. Bot comments often contain suppressed suggestions, security findings, or performance notes that are actionable.
3. For each comment or review body that implies an action is needed:
   - Attempt to address it (code fix or reply).
   - If code was changed: commit with `fix: address PR comment from @<reviewer> — <one-line description>`, then reply describing what was done.
   - If only a reply is needed (informational): reply without committing.
   - If you are **not sure** whether action is needed or how to act: use `ask_user` to ask the human operator.

### Step 3: Process CI Failures

1. Fetch the latest CI run for the PR branch:
   ```
   gh run list --branch <branch-name> --limit 1 --json databaseId,status,conclusion
   ```
2. If the latest run is passing or there are no runs: skip this step and report it.
3. For each **failing job**:
   ```
   gh run view RUN_ID --log-failed
   ```
4. Analyse the log output to identify the root cause.
5. Attempt to fix the code.
   - If confident: apply the fix, commit with `fix: resolve CI failure in <job-name> — <one-line description>`.
   - If **not confident**: use `ask_user` to describe the failure and ask how to proceed before continuing.

### Step 4: Push

1. Summarize all commits made during this session.
2. Use `ask_user` to confirm: _"I've made N commit(s). Ready to push to origin/<branch>?"_
3. If confirmed: run `git push`.
4. If declined: inform the user the commits are local and can be pushed later with `git push`.

## Constraints

- **Never push without explicit user confirmation.**
- **Never silently skip** a comment or CI failure — always fix it or escalate to the user.
- **One commit per fix** — do not squash or amend commits.
- **Only process unresolved** review threads — skip threads where `isResolved: true`.
- Use `gh` CLI for all GitHub interactions; avoid raw REST calls unless `gh` lacks the capability.

## Edge Cases

| Scenario | Behavior |
|---|---|
| No open PR on current branch | Abort with clear error |
| All review threads already resolved | Skip Step 1, proceed to Step 2 |
| No general PR comments | Skip Step 2, proceed to Step 3 |
| CI is passing | Skip Step 3, report success |
| Suggested change conflicts with current file state | Ask user how to proceed |
| Fix attempt causes new test failures (detected via CI re-run) | Report to user and ask how to proceed |
| Comment is a question with no actionable code request | Reply and ask user whether to resolve |
| General comment is clearly already addressed | Skip it |
| PR is in draft state | Warn the user; ask if they want to continue |

## Resolve a Review Thread (GraphQL)

Use this mutation to resolve a thread after addressing it:

```
gh api graphql -f query='
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { id isResolved }
    }
  }
' -F threadId=THREAD_ID
```

## Reply to a Review Thread Comment

```
gh api repos/OWNER/REPO/pulls/PR_NUMBER/comments/COMMENT_ID/replies \
  -X POST \
  -f body="Your reply here"
```

## Reply to a General PR Comment

```
gh api repos/OWNER/REPO/issues/PR_NUMBER/comments \
  -X POST \
  -f body="Your reply here"
```
