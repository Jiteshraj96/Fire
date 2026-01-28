# Firebase Employee & Salary CRUD (React + Vite + Tailwind + Firestore)

## Tech
- React (Vite)
- Tailwind CSS
- React Router
- Firebase Web SDK (Firestore, Auth optional)

## Firebase setup (Firestore)
1. Create a Firebase project in the Firebase console.
2. Create a **Web App** and copy the Firebase config values.
3. In Firebase console:
   - Enable **Firestore Database** (production mode or test mode).
   - (Optional) Enable **Authentication** if you want login later.
4. In this project root, create **`.env.local`** (Vite reads `import.meta.env.*`) and add:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> Example template is in `env.example` (rename/copy it to `.env.local`).

## Firestore collections structure

### `employees` (collection)
Document fields:
- `employee_code` (string)
- `name` (string)
- `email` (string)
- `phone` (string)
- `department` (string)
- `designation` (string)
- `joining_date` (string, `YYYY-MM-DD`)
- `status` (string: `active` or `inactive`)
- `created_at` (Firestore server timestamp)

### `salaries` (collection)
Document fields:
- `employee_id` (string; stores `employees/{id}` doc id)
- `basic_salary` (number)
- `hra` (number)
- `allowance` (number)
- `deduction` (number)
- `net_salary` (number; calculated in frontend)
- `month` (string, `YYYY-MM`)
- `created_at` (Firestore server timestamp)

### Index note
The Salaries list supports filtering by employee + ordering by `created_at`. Firestore may ask you to create a **composite index** for:
- `employee_id` (Ascending)
- `created_at` (Descending)

When that happens, Firebase will show a direct link to create the index.

## Run locally
```bash
npm install
npm run dev
```

### Convenience scripts
There is **no backend server** in this project (Firebase is the backend).

```bash
./start_frontend.sh
# or
./start.sh
```

## App routes
- `/employees` list
- `/employees/new` add
- `/employees/:id` view
- `/employees/:id/edit` edit
- `/salaries` list + filter
- `/salaries/new` add (supports `?employeeId=...`)
- `/salaries/:id/edit` edit

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
