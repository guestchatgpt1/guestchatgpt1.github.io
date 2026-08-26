# Webhook endpoint and reliability update

## Changes
- Update newsletter and contact integrations to the new `sovivik` endpoints with GET query parameters and POST JSON respectively.
- Update the chat assistant to call the new `sovivik` POST endpoint while preserving multi-turn messages, streaming-compatible rendering, voice input/output, loading, and error states.
- Keep the `kayoge6` feedback GET endpoint, but submit through a small public backend proxy to avoid browser CORS failures; validate fields, enforce a timeout, and return consistent success/error responses.
- Remove the obsolete direct feedback POST fallback and stale endpoint references.
- Update webhook contract tests for URLs, methods, payloads, network failures, and feedback proxy behavior.

## Technical details
- A new `feedback` backend function accepts validated JSON from the app, converts it to the required n8n GET query, applies a bounded timeout, and returns CORS-safe JSON.
- Existing shared webhook telemetry, honeypot protection, CAPTCHA token forwarding, form state, and fallback-form link remain unchanged.
- Verify with focused tests, project build diagnostics, and live browser interaction.
