# VMC Focus

> An unofficial application prototype based on the publicly available SBB Lyne Design System.

## Product vision

VMC Focus helps security and application teams identify which vulnerabilities require attention today, understand why they are important, and coordinate the next remediation action.

## Primary user problem

Vulnerability data is often technically detailed but difficult to prioritize. Users must combine severity, exploit probability, active exploitation, asset exposure, business criticality, ownership, and remediation deadlines.

VMC Focus turns these signals into an understandable and traceable decision workflow.

## Primary user

A vulnerability manager or security analyst who:

- reviews newly detected vulnerabilities;
- prioritizes remediation work;
- coordinates application owners and development teams;
- monitors deadlines and unresolved risks;
- documents decisions for later review.

## Core user journey

1. Open the prioritized Triage Inbox.
2. Understand why a vulnerability requires attention.
3. Inspect affected applications and assets.
4. Assign or document the next remediation action.
5. Verify that the risk has been resolved or accepted.

## MVP scope

The first usable version contains:

- a prioritized vulnerability inbox;
- filtering and sorting;
- an explainable risk assessment;
- a vulnerability detail view;
- affected assets and applications;
- ownership and remediation status;
- assignment of the next action;
- loading, empty, error, and permission states.

## Out of scope for the MVP

- authentication against a real organization;
- production vulnerability scanners;
- confidential SBB data;
- automated patch deployment;
- a complete vulnerability management platform;
- a full recreation of the internal SBB Figma library.

## UX principles

### Explain priority

Never show only a score. Explain the signals that caused the prioritization.

### Support decisions

Every screen should help the user decide or perform the next action.

### Reveal complexity progressively

Show the most relevant information first and technical details on demand.

### Make responsibility visible

Users should always understand who owns the affected system and the next action.

### Design for accessibility

Information must not depend on color alone. Keyboard navigation, visible focus, semantic structure, and understandable labels are required.

### Use Lyne before custom UI

Use existing Lyne components and design tokens wherever they satisfy the requirement. Custom styling must be limited and documented.

## Success criteria

A user can identify the highest-priority vulnerability, understand its priority, find the responsible team, and initiate the next action within two minutes.
