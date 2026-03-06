# Products API

## Overview

The Products API provides a read-only product catalog backed by an in-memory database (EF Core InMemory). It supports listing all products with optional filters and retrieving a single product by ID.

---

## Endpoints

### `GET /api/products`

Returns a list of all products. Supports optional query string filters.

**Query Parameters**

| Parameter  | Type      | Description                                 |
| ---------- | --------- | ------------------------------------------- |
| `category` | `string`  | Filter by exact category name               |
| `minPrice` | `decimal` | Return only products at or above this price |
| `maxPrice` | `decimal` | Return only products at or below this price |

**Example Requests**

```
GET /api/products
GET /api/products?category=Electronics
GET /api/products?minPrice=20&maxPrice=100
GET /api/products?category=Books&maxPrice=40
```

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones with 30-hour battery life.",
    "price": 149.99,
    "categoryName": "Electronics",
    "imageUrl": "https://placehold.co/400x300?text=Headphones",
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

---

### `GET /api/products/{id}`

Returns a single product by its ID.

**Route Parameters**

| Parameter | Type  | Description      |
| --------- | ----- | ---------------- |
| `id`      | `int` | The product's ID |

**Example Request**

```
GET /api/products/3
```

**Response `200 OK`**

```json
{
  "id": 3,
  "name": "Clean Code",
  "description": "A handbook of agile software craftsmanship by Robert C. Martin.",
  "price": 34.99,
  "categoryName": "Books",
  "imageUrl": "https://placehold.co/400x300?text=Clean+Code",
  "createdAt": "2026-01-03T00:00:00Z"
}
```

**Response `404 Not Found`** — returned when no product with the given ID exists.

---

## Data Model

### Product

| Field         | Type       | Notes                     |
| ------------- | ---------- | ------------------------- |
| `Id`          | `int`      | Primary key               |
| `Name`        | `string`   | Max 200 characters        |
| `Description` | `string`   | Max 2000 characters       |
| `Price`       | `decimal`  | Stored as `decimal(12,2)` |
| `CategoryId`  | `int`      | Foreign key → `Category`  |
| `ImageUrl`    | `string?`  | Optional                  |
| `CreatedAt`   | `DateTime` | UTC timestamp             |

### Category

| Field  | Type     | Notes              |
| ------ | -------- | ------------------ |
| `Id`   | `int`    | Primary key        |
| `Name` | `string` | Max 100 characters |

---

## Seed Data

The in-memory database is pre-populated on startup with the following data.

**Categories**

| Id  | Name        |
| --- | ----------- |
| 1   | Electronics |
| 2   | Books       |
| 3   | Clothing    |

**Products**

| Id  | Name                     | Category    | Price   |
| --- | ------------------------ | ----------- | ------- |
| 1   | Wireless Headphones      | Electronics | $149.99 |
| 2   | Mechanical Keyboard      | Electronics | $89.99  |
| 3   | Clean Code               | Books       | $34.99  |
| 4   | The Pragmatic Programmer | Books       | $39.99  |
| 5   | Classic Hoodie           | Clothing    | $49.99  |

---

## Implementation Notes

- Filters in `GET /api/products` are composed using `AsQueryable()`, so only the active filters are applied — each filter is optional and added conditionally.
- The API never exposes EF Core entity models directly. All responses use the `ProductResponse` DTO record.
- Swagger UI is available at `/swagger` when running in Development mode.
