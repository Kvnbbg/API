# DORA Metrics Implementation Plan

## Deployment Frequency
- Track successful runs of the `Modernization CI / Secure Container Build` job followed by production deployment workflow.
- Automate collection with a scheduled GitHub Actions workflow invoking `gh api repos/{owner}/{repo}/actions/runs` filtered by `workflow_id` and `conclusion == success`.
- Store metrics in BigQuery or ClickHouse for dashboarding.

## Lead Time for Changes
- Instrument PR metadata: compute time between first commit pushed to PR and merge timestamp.
- Use GitHub GraphQL API (`pullRequests` query) and persist metrics daily.
- Visualize rolling 7/30 day averages in Grafana.

## Change Failure Rate
- Define failure as any production deployment that triggers an incident (pager alert, rollback) or fails post-deploy checks.
- Instrument deployment workflow to label runs with `outcome=failed` on rollback events.
- Integrate with incident management (PagerDuty/Jira) to sync incident counts.

## Mean Time to Restore (MTTR)
- Measure time between incident creation and status `resolved` in PagerDuty.
- Export incidents via PagerDuty REST API to the same metrics warehouse.
- Use Grafana transformations to compute MTTR and correlate with deployment timestamps.

## Operationalization
- Create a lightweight service `metrics/dora-collector.js` that orchestrates API calls and writes to the data warehouse.
- Schedule collector via GitHub Actions cron (`0 * * * *`) or Airflow depending on data gravity.
- Publish dashboards to the company observability portal with SLO overlays to contextualize performance.
