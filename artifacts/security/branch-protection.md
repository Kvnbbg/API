# Branch Protection Ruleset (Proposed)

The following GitHub branch protection rules align with the Senior Developer's Modernization Framework and should be applied to the `main` branch as a baseline. Adjust thresholds for release branches (`release/*`) as needed.

1. **Require pull request reviews**
   - Minimum of 2 approving reviews.
   - Require review from code owners.
   - Dismiss stale approvals when new commits are pushed.

2. **Require status checks to pass before merging**
   - Mandatory checks:
     - `Modernization CI / Quality & Unit Safety Net`
     - `Modernization CI / Dependency & Secret Scans`
     - `Modernization CI / Static Analysis`
     - `Modernization CI / Secure Container Build`
   - Require branches to be up to date before merging.

3. **Require signed commits**
   - Enforce GPG or SSH signatures on all commits targeting protected branches.

4. **Require linear history**
   - Force merge commits to be disabled, ensuring a clean, linear commit history.

5. **Restrict who can push to matching branches**
   - Only the `@kvnbbg/release-engineering` team may bypass PR reviews for emergency hotfixes.

6. **Block force pushes and deletions**
   - Prevent rewriting history and deletion of the `main` branch.

7. **Secret scanning & Push protection**
   - Enable GitHub Advanced Security secret scanning and push protection.

8. **Deployment protection rules**
   - Require successful completion of the `Ephemeral Preview` job to promote awareness of runtime behavior.
   - Add an `Environments` policy for production that demands approval from `@kvnbbg/operations`.

9. **Issue linking enforcement**
   - Adopt a workflow automation that validates PR titles follow `<type>: <summary>` referencing a Linear/Jira ticket.

By institutionalizing these rules the team collapses the "vulnerability wave function" toward a secure ground state before merges reach production.
