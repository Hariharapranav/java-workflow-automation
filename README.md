# AuraFlow - Enterprise Workflow Automation System

This is a comprehensive enterprise-grade Workflow Automation application (Mini ServiceNow / Jira Approval Engine) built as requested.

## Tech Stack Overview

### Backend (`/backend`)
*   **Java 17 & Spring Boot 3+**: Foundation for building robust REST APIs.
*   **Spring Security & JWT**: Stateless authentication and role-based access control.
*   **Spring Data JPA & Hibernate**: ORM layer managing Postgres schema natively.
*   **PostgreSQL**: Relational database.
*   **Lombok**: Reduces boilerplate code.
*   **MapStruct**: Type-safe DTO mappings.
*   **Validation**: Integrates `jakarta.validation` safely.

### Frontend (`/frontend`)
*   **React (Vite) & TypeScript**: Modern and fast development environment.
*   **Tailwind CSS & Lucide React**: Beautiful user interface with consistent iconography and styling.
*   **React Hook Form & Zod**: Form validation safely.
*   **Axios**: Pre-configured interceptors matching JWT perfectly.
*   **React Router**: Protected Routing logic with Context API Auth state management.

## Setup Instructions

### Pre-requisites
*   Java 17
*   Maven 3.8+
*   Node.js 18+
*   PostgreSQL running locally on port 5432 (Database name: `workflow_db`, Username: `postgres`, Password: `postgres`)

### Running the Backend
1. Create the database in Postgres:
   ```sql
   CREATE DATABASE workflow_db;
   ```
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Compile and Run the Spring Boot app:
   ```bash
   mvn clean spring-boot:run
   ```
**(Note: The DataSeeder automatically creates 'admin@workflow.com' and 'manager@workflow.com' (passwords match schema defaults 'admin123' and 'manager123') into the database on startup.)**

### Running the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Application Features
1. **Dynamic Custom Workflows**: Admin users can create customized workflows dynamically defining arbitrary stages.
2. **Approval Sequencing**: Employees will be able to review requests based on the assigned order.
3. **Interactive Visual Dashboard**: A modern React Dashboard mapping timeline trails and statuses (Pending, Approved, Rejected) of payloads along with comment records automatically updating dynamically via state.
