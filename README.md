# PromptLab

## Project Overview and Purpose

PromptLab is an AI Prompt Engineering Platform that enables users to create, manage, and integrate AI-generated prompts at scale. Designed to streamline the development of AI applications, it offers functionality for seamless management of prompts and collections through a robust API.

## Features List

- Comprehensive management of prompts and collections via RESTful API
- Create, read, update, and delete (CRUD) operations
- Filter and sort capabilities for efficient data handling
- CORS-enabled to ensure frontend integration

## Prerequisites and Installation

Ensure you have `Python 3.10` or later and `pip` installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/yourrepo/promtlab.git
   cd promtlab/backend
   ```

2. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

## Quick Start Guide

To get started quickly with PromptLab, follow these steps:

1. Launch the FastAPI server with Uvicorn:

   ```bash
   uvicorn main:app --reload
   ```

2. Access the interactive API documentation at `http://localhost:8000/docs` to explore and test endpoints.

## API Endpoint Summary with Examples

### Prompts API

- **GET /prompts**: Retrieve all prompts
  - **Example**: `curl -X GET "http://localhost:8000/prompts"`

- **GET /prompts/{prompt_id}**: Retrieve a specific prompt by ID
  - **Example**: `curl -X GET "http://localhost:8000/prompts/{prompt_id}"`

- **POST /prompts**: Create a new prompt
  - **Example**:
    ```bash
    curl -X POST "http://localhost:8000/prompts" -H "accept: application/json" -H "Content-Type: application/json" -d '{"title":"New Prompt","content":"Example content","collection_id":"12345"}'
    ```

- **PUT /prompts/{prompt_id}**: Update a prompt
  - **Example**: `curl -X PUT "http://localhost:8000/prompts/{prompt_id}" -d '{ "title": "Updated Title" }'`

- **PATCH /prompts/{prompt_id}**: Partially update a prompt
  - **Example**: `curl -X PATCH "http://localhost:8000/prompts/{prompt_id}" -d '{ "description": "Updated description" }'`

- **DELETE /prompts/{prompt_id}**: Delete a prompt
  - **Example**: `curl -X DELETE "http://localhost:8000/prompts/{prompt_id}"`

### Collections API

- **GET /collections**: Retrieve all collections
- **POST /collections**: Create a new collection
- **DELETE /collections/{collection_id}**: Delete a collection

## Development Setup

For development, set up your environment as follows:

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run tests to ensure everything is set up correctly:

   ```bash
   pytest tests/ -v
   ```

## Contributing Guidelines

We appreciate contributions to PromptLab. Please follow these steps to contribute:

1. Fork the repository and clone your fork to your local machine.
2. Create a new branch for your feature or bug fix.
3. Implement your changes, ensuring adherence to the existing code style.
4. Write tests for any new functionality.
5. Push your changes to your fork and create a pull request.

Please ensure your pull request has a clear description of your changes and the problem they address.