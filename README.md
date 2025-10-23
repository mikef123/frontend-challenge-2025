## Notes for Reviewers

This project was developed as part of a **Frontend Technical Challenge** using **Next.js, React Query, and TypeScript**.  
It demonstrates a clean architecture with authentication, protected routes, and virtualized rendering for high performance.

- The **login** is a **fake authentication flow**, it generates and stores a mock token to simulate real login behavior.  
- The **API** uses a simulated endpoint (`fakestoreapi.com`) to fetch 2000 items, displayed through a **virtualized list** built with React Virtuoso.  
- The architecture follows **SOLID principles**, using separation of concerns between services, hooks, and components.  

## Installation & Setup

### Clone the repository

git clone https://github.com/mikef123/frontend-challenge-2025.git
cd frontend-challenge-2025

npm install
npm run dev

**Test Credentials**

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can log in using the following credentials:

Email: user@user.com
Password: password

---

## Learn More

## Solution Design

### Rendering the Home List
The product list is rendered using **React Virtuoso**, loaded lazily via `next/dynamic`.  
This enables **virtualized rendering**, displaying only the visible items on screen (20–40 instead of 2000), which improves the performance and memory usage.

A **loading skeleton** is displayed while fetching data, and the first few images are prioritized for better **LCP (Largest Contentful Paint)**.  
The `useItems` hook handles data normalization and caching through **React Query**, cleanly separating business logic from the UI.

**Advantages:**
- Efficient, smooth rendering even with large datasets.  
- Progressive loading (skeleton + lazy import).  
- Modular, maintainable code following the Single Responsibility Principle.

---

### Logout Strategy and Public/Private Context
Authentication is managed through a centralized **AuthProvider**, exposing `login`, `logout`, and `isAuthenticated`.  
The **private layout** (`(private)/layout.tsx`) protects internal routes, validating the token before rendering any content.

The **logout** process clears the token from both memory and `localStorage`, invalidates the session, and redirects the user to `/login`, ensuring a consistent logout experience.

**Advantages:**
- Single source of truth for authentication state.  
- Complete cleanup and redirection on logout.  
- Global logout synchronization across browser tabs.

---

### Theoretical Backend Efficiency Improvements
While this challenge uses simulated data (`fakestoreapi`), several real world backend optimizations are proposed:

1. **Pagination / Infinite Scroll:** Avoid loading all 2000 items at once.  
2. **Payload reduction.  
3. **GraphQL:** Combine multiple requests into a single roundtrip.

---

### 🧱 Project Structure

app/
├─ (public)/login/page.tsx → Public login page
├─ (private)/layout.tsx → Protected layout (auth guard)
├─ (private)/home/page.tsx → Virtualized list of 2000 items
context/
└─ AuthProvider.tsx → Global authentication management
hooks/
└─ useItems.ts → Data fetching & caching with React Query
services/
├─ api.client.ts → Axios client with interceptors
└─ auth.service.ts → Token handling, login/logout logic
components/
└─ list/VirtualList.tsx → Virtualized list UI (React Virtuoso)
