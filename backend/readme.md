# Oaxaca Backend

This is the Spring Boot backend for the TeamProject36 application.
The backend was developed incrementally during Sprint 1 to support the Menu page
and basic system setup.

## What has been implemented so far

 1. Backend setup & health check
- Spring Boot project created inside the `backend/` directory
- Standard layered structure added:
  - `controller`
  - `service`
  - `repository`
- Simple health check endpoint:
  - `GET /api/health`
  - Used to verify the backend is running correctly
(Issue 22 & 23)
---

 2. MenuItem database model
- Created a `MenuItem` JPA entity representing items shown on the menu
- Fields included:
  - `name`
  - `description`
  - `price`
  - `calories`
  - `allergens`
  - `available`
- Database table is created automatically on application startup using Hibernate
- `MenuItemRepository` added to allow database access
(Issue 24)
---
 3. Menu read endpoint (for customers)
- Implemented a customer-facing endpoint to fetch menu items
- Endpoint:
  - `GET /api/menu`
- Behaviour:
  - Returns menu items as JSON
  - Only returns items where `available = true`
  - Response includes:
    - name
    - description
    - price
    - calories
    - allergens
  - Returns an empty list if no items exist (not an error)
(Issue 25)
This endpoint is intended to be used directly by the frontend menu page.

---

# Running the backend locally

prerequisites
- Java 17+
- Docker (for PostgreSQL)

---

 Start the database
From the `backend/` directory:

```bash
docker compose up -d

