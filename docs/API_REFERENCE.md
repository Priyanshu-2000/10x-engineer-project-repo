### PromptLab API Documentation

#### Base URL
```
[BASE_URL]
```

#### Authentication
- None required currently.

---

### Endpoints

#### Health Check
- **GET** `/health`

  **Description**: Check the health status of the API.

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "status": "healthy",
      "version": "[version]"
    }
    ```

---

#### Prompts Endpoints

- **GET** `/prompts`

  **Description**: Retrieve a list of prompts, optionally filtering by collection ID and search query.

  **Query Parameters**:
  - `collection_id` (Optional): Filter by a specific collection.
  - `search` (Optional): Search prompts by text.

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "prompts": [...],
      "total": [number]
    }
    ```

- **GET** `/prompts/{prompt_id}`

  **Description**: Retrieve a prompt by its unique identifier.

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "id": "string",
      "title": "string",
      "content": "string",
      ...
    }
    ```

  **Error Responses**:
  - Status: `404 Not Found`
  - Body:
    ```json
    {
      "detail": "Prompt not found"
    }
    ```

- **POST** `/prompts`

  **Description**: Create a new prompt.
  
  **Request Body**:
    ```json
    {
      "title": "string",
      "content": "string",
      "collection_id": "string" // optional
    }
    ```

  **Response**:
  - Status: `201 Created`
  - Body:
    ```json
    {
      "id": "string",
      ...
    }
    ```

  **Error Responses**:
  - Status: `400 Bad Request`
  - Body:
    ```json
    {
      "detail": "Collection not found"
    }
    ```

- **PUT/PATCH** `/prompts/{prompt_id}`

  **Description**: Update an existing prompt's details.

  **Request Body**:
    ```json
    {
      "title": "string",
      "content": "string",
      "collection_id": "string" // optional
    }
    ```

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "id": "string",
      ...
    }
    ```

  **Error Responses**:
  - Status: `404 Not Found`
  - Body:
    ```json
    {
      "detail": "Prompt not found"
    }
    ```

---

#### Collection Endpoints

- **GET** `/collections`

  **Description**: Retrieve a list of all collections.

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "collections": [...],
      "total": [number]
    }
    ```

- **GET** `/collections/{collection_id}`

  **Description**: Retrieve a collection by its unique identifier.

  **Response**:
  - Status: `200 OK`
  - Body:
    ```json
    {
      "id": "string",
      "name": "string",
      ...
    }
    ```

  **Error Responses**:
  - Status: `404 Not Found`
  - Body:
    ```json
    {
      "detail": "Collection not found"
    }
    ```

- **POST** `/collections`

  **Description**: Create a new collection.

  **Request Body**:
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```

  **Response**:
  - Status: `201 Created`
  - Body:
    ```json
    {
      "id": "string",
      ...
    }
    ```

- **DELETE** `/collections/{collection_id}`

  **Description**: Delete a collection by its ID.

  **Response**:
  - Status: `204 No Content`

  **Error Responses**:
  - Status: `404 Not Found`
  - Body:
    ```json
    {
      "detail": "Collection not found"
    }
    ```