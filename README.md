# SOURCE Student Organization Website

A modern, high-performance web application built for the SOURCE student organization. The project utilizes React and Vite for the frontend, Supabase for authentication and database management, and Cloudflare Pages (with Cloudflare Functions) for hosting and server-side logic.

## Architecture Overview

* **Frontend:** React, Vite, CSS
* **Backend/Database:** Supabase (PostgreSQL, GoTrue Auth)
* **Hosting:** Cloudflare Pages
* **Serverless API:** Cloudflare Pages Functions (`/functions/api`)

## Prerequisites

Ensure the following dependencies are installed on your local development environment:

* [Node.js](https://www.google.com/search?q=https://nodejs.org/&utm_source=gemini) (v26.x.x^)
* npm (comes with Node.js)

## Environment Configuration

The project relies on two separate environment files to separate public variables from secure server-side secrets.

### 1. Frontend Environment Variables

Create a `.env` file in the root directory. These variables are compiled into the Vite frontend build.

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-anon-key>

```

### 2. Cloudflare Functions Secrets

To test server-side logic (such as the admin creation endpoint) locally, Wrangler requires a `.dev.vars` file in the root directory. This acts as the local equivalent of the Cloudflare Dashboard environment variables.

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-secret-service-role-key>

```

> **Warning:** Never commit `.env` or `.dev.vars` to version control. Ensure both files are included in your `.gitignore`.

## Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd source-website

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the standard frontend development server:**
With the latest node (v26), Cloudflare plugin is now embedded within the Vite ecosystem, which makes testing backend API endpoints like Cloudflare Functions seamless. Run standard Vite script:
```bash
npm run dev
```


The application will typically be available at `http://localhost:5173`.


Cloudflare will host the built static site and execute scripts located in the `/functions` directory simultaneously.

## Database Schema Setup

For local development to function correctly, your Supabase instance must contain the necessary table definitions and Row Level Security (RLS) policies.

## Deployment

This project is configured for automated deployments via Cloudflare Pages.

1. Push changes to the `master` branch.
2. Cloudflare will automatically trigger a build using the command `npm run build` and deploy the output from the `dist` directory.
3. Ensure all environment variables (including `SUPABASE_SERVICE_ROLE_KEY` as an encrypted secret) are configured in the Cloudflare Pages Dashboard.
