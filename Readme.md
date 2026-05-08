# Nexus Platform – Phase 2

A React-based collaboration platform designed for **Investors** and **Entrepreneurs** to connect, collaborate, and manage meetings efficiently.

This repository contains enhancements developed during the **Advanced Frontend Internship – Nexus Platform (Phase 2)**.

---

## Project Overview

Nexus is a frontend web application built using React and TypeScript.  
The goal of this phase is to enhance the existing platform by adding advanced collaboration modules such as scheduling, video calls, document handling, payments, and security features.

In **Week 1**, the focus was on:

- Project setup and codebase familiarization
- Understanding component structure and architecture
- UI consistency setup
- Meeting scheduling calendar integration

---

# Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | Frontend framework |
| TypeScript | Type safety |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | API communication |
| FullCalendar | Meeting scheduling calendar |
| CSS | Styling |
| ESLint | Code quality |

---

# Project Structure

```bash
src/
├── components/      # Reusable UI components
├── context/         # Global state/context management
├── data/            # Static/mock data files
├── pages/           # Main application screens/pages
│   └── Scheduling/  # Added scheduling module
├── types/           # TypeScript interfaces/types
├── App.tsx          # Root app component
├── main.tsx         # Application entry point
├── index.css        # Global styles
└── vite-env.d.ts    # Vite TypeScript definitions
```

---

# Architecture Overview

The application follows a **component-based frontend architecture**.

```text
User
 ↓
Pages (Routing Layer)
 ↓
Reusable Components
 ↓
Context / State Management
 ↓
API Layer (Axios)
 ↓
Backend Services
```

### Architecture Explanation

#### 1. Presentation Layer
Contains reusable UI components such as:
- Navbar
- Cards
- Buttons
- Forms
- Calendar widgets

Located in:

```bash
src/components/
```

---

#### 2. Page Layer
Handles full screens/routes like:
- Login
- Dashboard
- Scheduling

Located in:

```bash
src/pages/
```

---

#### 3. State Management Layer
Global app state is managed through React Context.

Examples:
- user authentication
- shared dashboard state
- scheduling data

Located in:

```bash
src/context/
```

---

#### 4. Data Layer
Stores static/mock data used in development.

Located in:

```bash
src/data/
```

---

#### 5. Type Layer
Contains TypeScript interfaces and reusable types.

Located in:

```bash
src/types/
```

---

# Routing Structure

Example application routes:

| Route | Description |
|------|-------------|
| `/login` | User login |
| `/dashboard` | Main dashboard |
| `/scheduling` | Meeting scheduling page |

Routing is managed using **React Router DOM**.

---

# Week 1 Feature Added – Scheduling Module

A new scheduling module was implemented inside:

```bash
src/pages/Scheduling/
```

### Features:
- Integrated **FullCalendar**
- Add availability slots
- Modify existing slots
- View scheduled meetings
- Responsive calendar layout

---

# UI & Theme

A consistent frontend theme is maintained using:

- responsive layout principles
- reusable components
- centralized styling in `index.css`
- mobile-friendly design
- clean typography and spacing

---

# Local Setup

Clone the repository:

```bash
git clone https://github.com/talhacodes-web/Nexus
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open browser:

```text
http://localhost:5173
```

---

# Deployment

### GitHub Repository
`https://github.com/talhacodes-web/Nexus`

### Vercel Deployment
`https://nexus-gold-three-73.vercel.app`

---

# Internship Deliverable Status

## Week 1
- [x] Project setup completed
- [x] Codebase familiarization completed
- [x] Architecture documented
- [x] Scheduling module added
- [x] Calendar integrated

---

## Author

Advanced Frontend Internship Submission  
Nexus Platform – Phase 2