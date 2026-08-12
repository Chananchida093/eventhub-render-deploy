# Gather — Event Registration Platform

A local-first event registration platform with separate member and administrator workflows.

## Stack

- React + Vite frontend
- Spring Boot 4 + Spring Security backend
- Spring Data JPA + local H2 file database
- Session-based authentication
- Thai/English UI with a persisted language toggle

## Run locally

Open two terminals from this directory.

```bash
cd backend
./mvnw spring-boot:run
```

```bash
cd frontend
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| User | `user@event.local` | `password` |
| Admin | `admin@event.local` | `admin123` |

## Supported flows

- Browse and search upcoming events without an account
- Require login before registration
- Register once, cancel, and see remaining capacity update
- Automatically close registration when an event starts or fills up
- Create, edit, and delete events as an admin
- Prevent capacity from being reduced below current registrations
- View the attendee list for each event
- Switch between Thai and English from the header on desktop or mobile
- Pessimistic database locking prevents overbooking under concurrent requests

## Verification

```bash
cd backend && ./mvnw test
cd frontend && npm run build
```

The backend suite covers capacity limits, duplicate registration, cancellation, automatic closing, and capacity regression protection.

## Render deployment

This copy includes a `Dockerfile` and `render.yaml` for a single Render Web Service. The Docker image builds the React app and serves it from Spring Boot, so the browser and API stay on the same origin and the existing `/api` calls do not need a frontend URL override.

In Render, create a new Blueprint from this repository and select `render.yaml`. The service is configured for the Singapore region and exposes `/api/events` as its health check.

The demo database remains H2 at `./data/eventhub`. On Render Free, the filesystem is ephemeral, so events and registrations are suitable for a showcase demo but should be moved to PostgreSQL or a persistent disk before real use.
