# VMC Focus

> An unofficial vulnerability management prototype built with Angular and the publicly available SBB Lyne Design System.

VMC Focus is a portfolio project for a UX/UI Developer role in cyber security. It explores how complex vulnerability data can be turned into an understandable, accessible, and traceable decision workflow.

This project is not an official SBB product and does not use confidential SBB data.

## Purpose

Security teams often need to combine multiple signals before deciding which vulnerability requires attention:

- technical severity;
- exploit probability;
- known active exploitation;
- internet exposure;
- business criticality;
- ownership;
- remediation deadlines.

VMC Focus helps users answer three questions:

1. Which vulnerability requires attention first?
2. Why is it important?
3. Who must take the next action?

## Current features

- Angular standalone application
- Lazy-loaded feature routing
- SBB Lyne Angular integration
- Lyne Lean Safety theme
- Triage Inbox
- Strictly typed vulnerability domain model
- Synthetic development fixtures
- Responsive semantic vulnerability list
- German user-facing content
- Unit tests and production builds

## Technology

| Area          | Technology                             |
| ------------- | -------------------------------------- |
| Frontend      | Angular 22                             |
| Language      | TypeScript                             |
| Design system | SBB Lyne Angular                       |
| Theme         | Lean Safety                            |
| Styling       | SCSS and Lyne design tokens            |
| Testing       | Vitest through the Angular test runner |
| Backend       | Planned PHP REST API                   |
| API contract  | Planned OpenAPI specification          |
| Design        | Planned Figma case study               |

## Language convention

- User interface and demo content: German
- Source code, identifiers, filenames, commits, and documentation: English
- Established terms such as CVE, CVSS, EPSS, API, and SLA remain unchanged

## Getting started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone <repository-url>
cd vmc-focus
npm install
```

### Start development

```bash
npm start
```

Open:

```text
http://localhost:4200
```

The application redirects to:

```text
http://localhost:4200/triage
```

## Available scripts

| Command                     | Description                            |
| --------------------------- | -------------------------------------- |
| `npm start`                 | Starts the Angular development server. |
| `npm run build`             | Creates a production build.            |
| `npm test -- --watch=false` | Runs all tests once and exits.         |

## Lyne development helpers

### Show installed Lyne Angular version

```bash
node -p "require('./node_modules/@sbb-esta/lyne-angular/package.json').version"
```

### Show available Lyne Angular entry points

```bash
grep -o '"\./[^"]*"'   node_modules/@sbb-esta/lyne-angular/package.json |
  sort
```

Filter the result for specific component groups:

```bash
grep -o '"\./[^"]*"'   node_modules/@sbb-esta/lyne-angular/package.json |
  grep -E 'header|sidebar|navigation|container|link|button' |
  sort
```

### Inspect the installed API of a component

```bash
sed -n '1,220p'   node_modules/@sbb-esta/lyne-angular/types/sbb-esta-lyne-angular-header.d.ts
```

This is useful because the installed Lyne API may differ from examples written for another version.

## Project structure

```text
src/app/
├── app.config.ts
├── app.routes.ts
├── app.ts
├── app.html
├── app.scss
└── features/
    └── triage/
        ├── domain/
        │   ├── vulnerability.model.ts
        │   └── vulnerability.fixtures.ts
        └── pages/
            └── triage-inbox/
                ├── triage-inbox.ts
                ├── triage-inbox.html
                ├── triage-inbox.scss
                └── triage-inbox.spec.ts
```

## Architecture principles

- Keep domain models independent from presentation components.
- Load feature pages lazily.
- Use strict TypeScript types at application boundaries.
- Prefer Lyne components and design tokens over custom UI.
- Keep fixture data replaceable by a service or API adapter.
- Model loading, empty, error, permission, and success states explicitly.
- Prefer semantic HTML and accessible interaction patterns.
- Keep commits focused and independently verifiable.

## Domain model

The current domain model contains:

- vulnerability severity and status;
- remediation urgency;
- CVSS score;
- EPSS probability;
- known-exploited status;
- affected assets and applications;
- exposure level;
- business criticality;
- ownership;
- remediation deadlines;
- explainable risk signals.

All vulnerability records, CVE identifiers, people, teams, applications, and assets currently used by the project are synthetic demo data.

## UX principles

### Explain priority

Never display only a score. Show the signals that caused a vulnerability to be prioritized.

### Support decisions

Every screen should help the user understand or perform the next action.

### Reveal complexity progressively

Show the most relevant information first and technical details on demand.

### Make responsibility visible

The responsible team and next action should always be understandable.

### Design for accessibility

Information must not depend on color alone. Keyboard navigation, visible focus, semantic structure, and understandable labels are required.

### Use Lyne before custom UI

Existing Lyne components and design tokens are preferred. Custom styling should be limited and documented.

## Planned flow

```text
Triage Inbox
    ↓
Vulnerability details
    ↓
Affected assets and applications
    ↓
Assign or document remediation
    ↓
Verify, resolve, or accept risk
```

## Roadmap

- Lyne application shell
- Primary navigation and responsive sidebar
- Search, filtering, and sorting
- Explainable priority summaries
- Vulnerability detail view
- Remediation workflow
- Loading, empty, error, and permission states
- PHP REST API
- OpenAPI contract
- Accessibility and end-to-end tests
- GitLab CI
- Figma case study and developer handoff

## Product documentation

The detailed product vision, MVP scope, user journey, UX principles, and success criteria are documented in:

```text
docs/PRODUCT.md
```

## License and attribution

This repository is an independent portfolio prototype.

SBB, Lyne, and the installed Lyne packages belong to their respective owners. Refer to their respective documentation and licenses for usage terms.
