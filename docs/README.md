# Testing Guide

## Running Tests

**All tests:**
```bash
npm run test:docker
```

**Development (auto-rerun):**
```bash
npm run test:watch
```

**Coverage report:**
```bash
npm run test:coverage
```

## What's Tested

- **POST /query** - Create queries with validation
- **PATCH /query/:id** - Update queries
- **DELETE /query/:id** - Delete queries  
- **GET /form-data** - Form data with queries included

Total: 21 tests covering happy path, validation, error cases, and integration scenarios.

## Test Structure

```
tests/
└── routes/
    ├── query.test.ts        # Query endpoints (19 tests)
    └── formData.test.ts     # Form data (2 tests)
```

Uses Jest + Supertest. Tests run against the development database. 