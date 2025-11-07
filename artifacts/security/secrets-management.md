# Secrets Management Modernization Plan

To secure AliExpress credentials and future integrations, adopt a centralized secrets manager with the following staged rollout.

## Stage 1 – Foundation (Week 1)
- Deploy **HashiCorp Vault** (OSS or HCP) in HA mode within the production VPC.
- Enable Raft storage backend with integrated auto-unseal via cloud KMS (AWS KMS or GCP KMS depending on hosting).
- Configure auth methods:
  - GitHub OIDC for CI/CD workflows (GitHub Actions).
  - Kubernetes Service Account JWT (if the Node app runs in K8s) or AppRole for VM deployments.
- Migrate existing `.env` secrets into Vault's KV v2 engine under `kv/kvnbbg-api/`.

## Stage 2 – CI/CD Integration (Week 2)
- Update GitHub Actions workflow to request short-lived secrets via OIDC JWT exchange using `hashicorp/vault-action`.
- Replace static repository secrets with dynamic Vault reads (app key, app secret, tracking ID, Fly.io token).
- Enforce audit logging and configure `vault audit enable file file_path=/var/log/vault_audit.log`.

## Stage 3 – Runtime Injection (Week 3-4)
- Instrument deployment platform to fetch secrets at runtime:
  - For Kubernetes: leverage Vault Agent Injector or Secrets Store CSI Driver to mount secrets as tmpfs files with automatic renewal.
  - For VM/Edge deployments: run Vault Agent in sidecar mode templating environment variables into `/run/secrets/kvnbbg-api.env`.
- Rotate AliExpress credentials and all API tokens after cutover.

## Stage 4 – Advanced Controls (Week 5+)
- Define Sentinel or OPA policies restricting access to secrets based on namespace/team.
- Introduce dynamic secrets (e.g., short-lived database credentials) when storage backends are introduced.
- Integrate Vault metrics with Prometheus/Grafana to monitor seal status, token issuance, and request latency.

**Outcome:** secrets are never stored in Git history or CI environment variables for longer than necessary, constricting the attack surface and aligning with zero-trust principles.
