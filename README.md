# Gen.G Fandom Platform

A comprehensive fan engagement platform for Gen.G Esports League of Legends team, built with Next.js 15, TypeScript, and Real-time technologies.

## Overview

This project serves as a centralized hub for the Gen.G fan community. It aggregates match schedules, player statistics, and historical achievements while providing interactive features such as real-time viewing parties, community chats, and fan engagement minigames.

## Key Features

**Core Functionality**
*   **Team Roster**: Detailed profiles for Main and Challenger lineups with performance metrics.
*   **Match Center**: Real-time match status, schedules, and historical results.
*   **Legacy Timeline**: Interactive history tracking from the Samsung Galaxy era.

**Fan Engagement**
*   **Viewing Parties**: Live stream integration with real-time chat and ban/pick prediction systems.
*   **Interactive Modules**: "Church of Chovy" and "Genrang Corner" minigames.
*   **Staff Dashboard**: Administrative interface for managing matches, users, and content.

**Technical Highlights**
*   **PWA Support**: Progressive Web App capabilities for native-like mobile experience.
*   **Real-time Updates**: Socket.io integration for instant data propagation.
*   **Security**: JWT-based authentication with bcrypt password hashing and Turnstile protection.

## Technology Stack

### Frontend
*   **Framework**: Next.js 15.5 (App Router)
*   **Language**: TypeScript 5.7
*   **Styling**: Tailwind CSS 3.4
*   **State Management**: TanStack Query
*   **Motion**: Framer Motion

### Backend & Infrastructure
*   **Runtime**: Node.js
*   **Database**: MySQL / MariaDB via Prisma ORM
*   **Real-time**: Socket.io 4.8
*   **Authentication**: Custom JWT Auth

## Project Structure

```
gen-g-fandom/
├── app/                  # Next.js App Router & API endpoints
├── components/           # Reusable UI components
│   ├── layout/           # Header, Footer, Providers
│   ├── viewing-party/    # Real-time chat & stream components
│   └── ...
├── lib/                  # Utilities, auth logic, and DB clients
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── scripts/              # Database seeding and maintenance scripts
```

## Getting Started

### Prerequisites
*   Node.js 18 or higher
*   MySQL 8.0 or MariaDB
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd gen-g-fandom
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    # Database
    DATABASE_URL="mysql://root:password@localhost:3306/geng_fandom"

    # Authentication
    JWT_SECRET="your-secure-secret-key"
    
    # Cloudflare Turnstile
    NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-site-key"
    TURNSTILE_SECRET_KEY="your-secret-key"

    # Socket.io
    NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
    ```

4.  **Database Setup**
    Initialize the database and apply the schema:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Default Credentials

For development purposes, the following accounts can be seeded:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@geng.gg | admin | Full System Access |
| Staff | staff@geng.gg | staff123 | Content Management |
| Fan | fan@geng.gg | fan123 | Standard User Access |

> **Note**: Ensure strictly different credentials are used in production environments.

## License

This project is a fan-made initiative and is not officially affiliated with Gen.G Esports.
