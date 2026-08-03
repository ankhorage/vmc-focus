# VMC Focus

[![CI](https://github.com/ankhorage/vmc-focus/actions/workflows/ci.yml/badge.svg)](https://github.com/ankhorage/vmc-focus/actions/workflows/ci.yml)

> **Vulnerability Management Cockpit** — an unofficial vulnerability management
> prototype built with Angular and the publicly available SBB Lyne Design System.

VMC Focus is a portfolio project for a UX/UI Developer role in cyber security. It
explores how complex vulnerability data can be turned into an understandable,
accessible, and traceable decision workflow.

The name **Focus** reflects the product goal: helping security teams focus on the
vulnerabilities that require attention first and understand why.

This project is not an official SBB product and does not use confidential SBB data.

## Purpose

Security teams often need to combine multiple signals before deciding which
vulnerability requires attention:

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
- Responsive application shell
- Desktop sidebar and mobile overlay navigation
- Triage Inbox
- Strictly typed vulnerability domain model
- Synthetic development fixtures
- Responsive semantic vulnerability list
- German user-facing content
- Angular template accessibility linting
- ESLint and Prettier validation
- Knip unused-code analysis
- Vitest unit tests
- Production bundle budgets
- GitHub Actions continuous integration

## Technology

| Area                   | Technology                             |
| ---------------------- | -------------------------------------- |
| Frontend               | Angular 22                             |
| Language               | TypeScript                             |
| Design system          | SBB Lyne Angular                       |
| Theme                  | Lean Safety                            |
| Styling                | SCSS and Lyne design tokens            |
| Testing                | Vitest through the Angular test runner |
| Linting                | Angular ESLint                         |
| Formatting             | Prettier                               |
| Code analysis          | Knip                                   |
| Continuous integration | GitHub Actions                         |
| Backend                | Planned PHP REST API                   |
| API contract           | Planned OpenAPI specification          |
| Design                 | Planned Figma case study               |

## Language convention

- User interface and demo content: German
- Source code, identifiers, filenames, commits, and documentation: English
- Established terms such as CVE, CVSS, EPSS, API, and SLA remain unchanged

## Getting started

### Prerequisites

- Node.js 22
- npm 11

### Installation

```bash
git clone git@github.com:ankhorage/vmc-focus.git
cd vmc-focus
npm ci
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

| Command                     | Description                                    |
| --------------------------- | ---------------------------------------------- |
| `npm start`                 | Starts the Angular development server.         |
| `npm run build`             | Creates an optimized production build.         |
| `npm run watch`             | Builds continuously in development mode.       |
| `npm test -- --watch=false` | Runs all unit tests once and exits.            |
| `npm run lint`              | Lints TypeScript and Angular templates.        |
| `npm run format`            | Formats supported project files with Prettier. |
| `npm run format:check`      | Verifies formatting without changing files.    |
| `npm run knip`              | Finds unused files, exports, and dependencies. |

## Local validation

Run the same quality checks used by continuous integration:

```bash
npm run lint
npm run format:check
npm run knip
npm test -- --watch=false
npm run build
```

Production dependencies can be audited separately from development tooling:

```bash
npm audit --omit=dev --audit-level=moderate
```

The complete development dependency tree can currently contain audit findings in
transitive Angular CLI tooling. These findings do not affect the production
dependency tree and must not be resolved through forced breaking downgrades.

## Continuous integration

GitHub Actions validates every pull request and every push to `main`.

The CI workflow performs:

1. reproducible installation with `npm ci`;
2. production dependency audit;
3. TypeScript and Angular template linting;
4. formatting verification;
5. unused-code and dependency analysis;
6. unit tests;
7. production build.

The workflow uses read-only repository permissions and cancels superseded runs for
the same branch.

The workflow is defined in:

```text
.github/workflows/ci.yml
```

## Lyne development helpers

### Show installed Lyne Angular version

```bash
node -p "require('./node_modules/@sbb-esta/lyne-angular/package.json').version"
```

### Show available Lyne Angular entry points

```bash
grep -o '"\./[^"]*"' \
  node_modules/@sbb-esta/lyne-angular/package.json |
  sort
```

Filter the result for specific component groups:

```bash
grep -o '"\./[^"]*"' \
  node_modules/@sbb-esta/lyne-angular/package.json |
  grep -E 'header|sidebar|navigation|container|link|button' |
  sort
```

### Inspect the installed API of a component

```bash
sed -n '1,220p' \
  node_modules/@sbb-esta/lyne-angular/types/sbb-esta-lyne-angular-header.d.ts
```

This is useful because the installed Lyne API may differ from examples written for
another version.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── PRODUCT.md
├── src/
│   └── app/
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── app.ts
│       ├── app.html
│       ├── app.scss
│       └── features/
│           └── triage/
│               ├── domain/
│               │   ├── vulnerability.model.ts
│               │   └── vulnerability.fixtures.ts
│               └── pages/
│                   └── triage-inbox/
│                       ├── triage-inbox.ts
│                       ├── triage-inbox.html
│                       ├── triage-inbox.scss
│                       └── triage-inbox.spec.ts
├── angular.json
├── eslint.config.js
├── package.json
└── README.md
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
- Keep the production dependency tree free from known vulnerabilities.
- Treat bundle budgets as explicit quality constraints.

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

All vulnerability records, CVE identifiers, people, teams, applications, and assets
currently used by the project are synthetic demo data.

## UX principles

### Explain priority

Never display only a score. Show the signals that caused a vulnerability to be
prioritized.

### Support decisions

Every screen should help the user understand or perform the next action.

### Reveal complexity progressively

Show the most relevant information first and technical details on demand.

### Make responsibility visible

The responsible team and next action should always be understandable.

### Design for accessibility

Information must not depend on color alone. Keyboard navigation, visible focus,
semantic structure, and understandable labels are required.

### Use Lyne before custom UI

Existing Lyne components and design tokens are preferred. Custom styling should be
limited and documented.

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

- Vulnerability status and severity presentation with Lyne components
- Search, filtering, and sorting
- Explainable priority summaries
- Vulnerability detail view
- Remediation workflow
- Loading, empty, error, and permission states
- PHP REST API
- OpenAPI contract
- Browser-based end-to-end tests
- Additional GitHub Actions quality and deployment checks
- Figma case study and developer handoff

## Product documentation

The detailed product vision, MVP scope, user journey, UX principles, and success
criteria are documented in:

```text
docs/PRODUCT.md
```

## License and attribution

This repository is licensed under the MIT License. See:

```text
LICENSE
```

This repository is an independent portfolio prototype.

SBB, Lyne, and the installed Lyne packages belong to their respective owners. Refer
to their respective documentation and licenses for usage terms.
