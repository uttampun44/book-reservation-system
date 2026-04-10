<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
=======

# Book Reservation System – Agile Development Project

## Overview

This is a full‑stack web application that allows users to:
- Create an account and log in
- Browse a catalogue of books
- Search for books by title or author
- Reserve available books
- View and cancel their reservations

The project was developed as part of the **Advanced Topics in Software Engineering** (Assessment 2) at the University of West London. It demonstrates agile software development using Scrum, version control with Git/GitHub, continuous integration/deployment, and test‑driven practices.

## Team & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| **Sagun** | Scrum Master | Jira management, sprint planning, stand‑ups, retrospectives, report coordination |
| **Alisha** | Product Owner / UX | User stories, wireframes, acceptance criteria, prototype verification |
| **Uttam** | DevOps / Backend | CI/CD, testing, backend logic, deployment |
| **Indra** | Frontend | HTML/CSS, UI components, frontend implementation |

## Three Prototypes (Sprints)

| Sprint | Focus |
|--------|-------|
| **Sprint 1** | Login, Signup, Browse & View |
| **Sprint 2** | Reserve a Book | 
| **Sprint 3** | My Reservations & Cancel | 

## Technology Stack

- **Frontend**: React.Js, Typescript, TailwindCSS
- **Backend (mock)**: MongoDB, Node.Js and Express.Js
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions (automated tests) + Netlify (automatic deployment)
- **Project Management**: Jira (Scrum board)

## Getting Started

To run this project locally:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/book-reservation-system.git
   cd book-reservation-system
>>>>>>> main
