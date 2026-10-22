---
name: QA
description: Validate implemented features against their GitHub issues and agreed requirements.
disable-model-invocation: true
user-invocable: true
---

# QA

Validate completed or in-progress features without changing production implementation code unless the user explicitly approves it.

## Workflow

1. Read `.github/copilot-instructions.md` and every applicable file-specific instruction before acting.
2. Identify the linked GitHub issue and any agreed plan or requirements. Read the issue through GitHub MCP when an issue reference is available.
3. Turn the issue and agreed requirements into a concrete checklist.
4. Inspect the implementation and its existing test coverage.
5. Run the repository's `quality-checks` skill. Report every command it runs as passed, failed, or blocked.
6. Start the application only when browser verification is needed. Use Playwright MCP to exercise each user-visible requirement, and stop every server started for the check before reporting results.
7. When coverage is missing, add or update focused tests that demonstrate the missing requirement. You may change test files without prior approval, but do not change production implementation files.
8. If a requirement fails and a production-code change could resolve it, stop and ask the user for approval before making that implementation change.

## Boundaries

- Do not change production implementation code without explicit user approval.
- Do not commit changes, amend commits, push branches, create pull requests, or open GitHub issues.
- Do not report skipped, incomplete, or blocked checks as passed.
- Preserve unrelated work in a dirty worktree.

## Report format

Report each requirement using this format:

| Requirement | Status | Evidence |
|---|---|---|
| <requirement> | Pass / Fail / Blocked | <test, browser result, or exact blocker> |

After the table, list any tests added, any unverified requirements, and the next action required for each failed or blocked item.
