# VMC Focus

[![CI](https://github.com/ankhorage/vmc-focus/actions/workflows/ci.yml/badge.svg)](https://github.com/ankhorage/vmc-focus/actions/workflows/ci.yml)

**Vulnerability Management Cockpit** — an independent vulnerability-management
prototype built with Angular and the publicly available SBB Lyne Design System.

> [!IMPORTANT]
> **Independent portfolio prototype.** This project is not an official SBB product.
> It uses only synthetic demo data and contains no confidential SBB information.

## Live demo

**[Open VMC Focus](https://vmc-focus.ankhorage.com)**

VMC Focus is a portfolio case study for a UX/UI Developer role in cyber security. It
explores how complex vulnerability data can be transformed into an understandable,
accessible, and traceable decision workflow.

The name **Focus** reflects the central product goal: helping security teams identify
which vulnerabilities require attention first and understand why.

## Current status

The implemented Triage Inbox currently demonstrates:

- risk-based vulnerability prioritization;
- explainable risk signals;
- search across vulnerability information;
- severity and workflow-status filtering;
- sorting by priority, CVSS, EPSS, and remediation deadline;
- responsive application navigation and content presentation;
- accessible interaction patterns using SBB Lyne components;
- synthetic German-language vulnerability data.

The next product milestone is a vulnerability detail view with affected assets,
ownership, and remediation actions.

## Product goal

Security teams often need to combine several signals before deciding which
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

### Triage and prioritization

- Prioritized inbox for open vulnerabilities
- Risk-based default ordering
- Explainable prioritization through progressively disclosed risk signals
- CVE, title, description, team, and risk-signal search
- Case-insensitive and diacritic-insensitive search
- Multi-select severity filtering
- Workflow-status filtering
- Sorting by:
  - risk priority;
  - highest or lowest CVSS;
  - highest EPSS;
  - nearest remediation deadline
- Combined search, filtering, and sorting
- Live result count
- Explicit empty-result state
- Shared filter-reset action
- Sorting retained independently from filter reset

### Vulnerability information

- Synthetic CVE identifiers
- Technical severity
- CVSS score
- EPSS probability
- Known-exploited state
- Workflow status
- Responsible team
- Affected assets and applications in the domain model
- Exposure and business-criticality information
- Remediation urgency and deadline
- Explainable risk signals

### UX and accessibility

- German user-facing content using Swiss spelling conventions
- Responsive desktop, tablet, and mobile layouts
- Light and dark theme support through Lyne
- Information hierarchy that does not depend on color alone
- Semantic headings and content structure
- Explicit form labels
- Keyboard-accessible Lyne controls
- Visible workflow and severity labels
- Progressive disclosure for detailed risk explanations
- Distinction between filtering and sorting

### SBB Lyne integration

- Lyne Lean Safety theme
- Responsive Lyne application shell
- Lyne header and environment indicator
- Lyne sidebar navigation
- Lyne container layout
- Lyne cards
- Lyne form fields and clear control
- Lyne select and option components
- Lyne tag group for multi-select filtering
- Lyne status components
- Lyne expansion panels
- Lyne chip labels
- Lyne message, title, and button components
- Preference for Lyne components before custom UI

### Engineering

- Angular 22 standalone application
- Strict TypeScript configuration
- Lazy-loaded feature routing
- Signal-based local UI state
- Strictly typed vulnerability domain model
- Synthetic development fixtures
- Angular template accessibility linting
- ESLint and Prettier validation
- Knip unused-code analysis
- Vitest unit tests
- Production bundle budgets
- GitHub Actions continuous integration
- Production dependency auditing

## Technology

| Area                   | Technology                             |
| ---------------------- | -------------------------------------- |
| Frontend               | Angular 22                             |
| Language               | TypeScript                             |
| Design system          | SBB Lyne Angular                       |
| Theme                  | Lean Safety                            |
| Styling                | SCSS and Lyne design tokens            |
| State                  | Angular Signals                        |
| Testing                | Vitest through the Angular test runner |
| Linting                | Angular ESLint                         |
| Formatting             | Prettier                               |
| Code analysis          | Knip                                   |
| Continuous integration | GitHub Actions                         |
| Backend                | Planned PHP REST API                   |
| API contract           | Planned OpenAPI specification          |
| Design documentation   | Planned Figma case study               |

## Language convention

- User interface and demo content: German
- Source code, identifiers, filenames, commits, and documentation: English
- Established terms such as CVE, CVSS, EPSS, API, and SLA remain unchanged
- German UI copy follows Swiss spelling conventions

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
| `npm run lint:fix`          | Applies automatically fixable lint rules.      |
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

The complete development dependency tree can contain audit findings in transitive
Angular CLI tooling. These findings do not affect the production dependency tree and
must not be resolved through forced breaking downgrades.

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

The workflow uses read-only repository permissions and cancels superseded runs for the
same branch.

The workflow is defined in:

```text
.github/workflows/ci.yml
```

## Lyne development workflow

Before introducing a custom UI component or interaction:

1. inspect whether Lyne provides a suitable component;
2. inspect the API of the installed Lyne version;
3. review the official component documentation and examples;
4. use custom HTML and SCSS only for application-specific structure and layout.

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
  grep -E 'header|sidebar|navigation|container|select|tag|status|button' |
  sort
```

### Inspect the installed API of a component

```bash
sed -n '1,220p' \
  node_modules/@sbb-esta/lyne-angular/types/sbb-esta-lyne-angular-select.d.ts
```

The installed Lyne API may differ from examples written for another version.

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── .vscode/
│   └── settings.json
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
├── .hintrc
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
- Verify the installed Lyne API before implementing a UI pattern.
- Keep fixture data replaceable by a service or API adapter.
- Model loading, empty, error, permission, and success states explicitly.
- Prefer semantic HTML and accessible interaction patterns.
- Keep filtering and sorting responsibilities distinct.
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
used by the project are synthetic demo data.

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

### Separate filtering and sorting

Filtering controls which records are visible. Sorting controls only their order. These
operations should remain visually and behaviorally distinct.

### Design for accessibility

Information must not depend on color alone. Keyboard navigation, visible focus,
semantic structure, and understandable labels are required.

### Use Lyne before custom UI

Existing Lyne components and design tokens are preferred. Custom styling should be
limited to application-specific layout, documented exceptions, and cases where Lyne
provides no suitable component.

### Preserve visual restraint

Cyber-security interfaces should communicate urgency and hierarchy without turning
every element into an alert. Color, elevation, and emphasis must carry meaning.

## Implemented user flow

```text
Open Triage Inbox
    ↓
Search or filter vulnerabilities
    ↓
Sort the visible results
    ↓
Identify the highest-priority vulnerability
    ↓
Understand its risk signals
    ↓
Find its workflow status and responsible team
```

## Planned product flow

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

### Completed Triage Inbox capabilities

- Prioritized vulnerability cards
- Explainable risk signals
- Vulnerability search
- Severity filter
- Workflow-status filter
- Sorting by priority, CVSS, EPSS, and deadline
- Combined search and filtering
- Filter reset
- Empty-result state
- Responsive presentation
- Unit-test coverage for search, filtering, sorting, and reset behavior

### Next product milestone

- Vulnerability detail view
- Affected assets and applications
- Ownership and assignment action
- Remediation workflow
- Resolution and risk-acceptance decisions
- Audit trail

### Additional application states

- Loading state
- API error state
- Permission state
- Success confirmation
- Empty inbox state

### Platform and delivery

- PHP REST API
- OpenAPI contract
- Browser-based end-to-end tests
- Public preview environment
- Deployment workflow
- Figma case study and developer handoff documentation

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

This repository is an independent portfolio prototype and is not an official SBB
product.

SBB, Lyne, and the installed Lyne packages belong to their respective owners. Refer to
their respective documentation and licenses for usage terms.
