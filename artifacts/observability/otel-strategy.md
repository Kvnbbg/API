# Observability Enablement Plan

To lift the API into a measurable, debuggable state the following OpenTelemetry-first plan is recommended.

## Logging
- Adopt `pino` with `pino-http` for structured JSON logs.
- Configure correlation IDs using middleware injecting `x-request-id` if not present.
- Ship logs to Loki via Promtail or to Elastic using Filebeat.

## Metrics
- Integrate `@opentelemetry/sdk-node` with the metrics API and export to Prometheus via `@opentelemetry/exporter-prometheus`.
- Capture default Node.js runtime metrics (event loop lag, heap usage) and custom business metrics (AliExpress proxy latency, error rate per endpoint).

## Tracing
- Instrument Express using `@opentelemetry/instrumentation-express` and propagate trace headers through Caddy via `traceparent`.
- Export spans to an OpenTelemetry Collector configured with the OTLP/HTTP receiver and Jaeger/Tempo exporters.

## Alerting
- Define SLOs: 99.5% success for affiliate proxies, 200ms p95 response time for `/docs`.
- Create alert rules in Prometheus/Grafana based on error budgets and latency thresholds.

## Governance
- Store collector configuration in `infrastructure/otel/collector.yaml` (tracked via IaC).
- Add observability smoke checks to CI (see `observability` job in `Modernization CI`).

**Result:** observability data collapses uncertainty about runtime behavior, enabling rapid MTTR improvements and DORA metric tracking.
