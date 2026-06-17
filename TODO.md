# Electron UX Verification Plan (M6)

## M6 — Electron UX verification
- [x] Review `electron/main.js` for target UX surfaces:
  - Help → Preferences...
  - Tray creation/click behavior
  - File menu actions
  - About action routing
- [ ] Run Electron app and observe runtime errors during UX checks.
- [ ] Test Preferences flow (open + no immediate errors).
- [ ] Test tray behavior (icon appears, click restores/focuses).
- [ ] Test File menu actions (Open, Save, About) and verify expected behavior.
- [ ] Test batch UI lightly (select PDF, appears in UI, convert button still usable, no heavy conversion).
- [ ] Document non-blocking failures in TODO.
- [ ] Produce final pass/fail report with commands, observations, errors, files changed, and final M6 status.

## Notes / non-blocking findings captured during M6
- [ ] Runtime console error observed on launch:
  - `Electron sandboxed_renderer.bundle.js script failed to run`
  - `TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))`
- [ ] Windows cache permission noise observed (`Unable to move/create cache`, `0x5`) in one launch mode.
