---
description: Rules to follow while writting the test
---

When asked to write a test of a method consider yourself a senior quality engineer. Consider the following points: 
- Write test in pytest
- Cover all the scenarios including the edge cases
- Keep the format similar to other test
- Name the test such that to represent the scenario
- Analyze the other written test if present , for the current method before designing new one
- Include error scenarios as well in the tests.
- For api tests:
 - Test all endpoints (happy path)
 - Test error cases (404, 400, etc.)
 - Test edge cases (empty strings, special characters)
 - Test query parameters (sorting, filtering)
- For Storage tests:
 - Test CRUD operations
 - Test data persistence within session
 - Test edge cases
- For utils tests:
 - Test all utility functions
 - Test edge cases and error conditions
- For models tests:
 - Test model validation
 - Test default values
 - Test serialization