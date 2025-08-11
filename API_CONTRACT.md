1. User & Profile Management
Feature: User Registration
HTTP Method: POST

Endpoint Path: /api/auth/register

Description: Creates a new user account with a username, email, and password.

Request Body:

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Success Response (201 Created):

{
  "message": "User registered successfully.",
  "user": {
    "id": "uuid-string",
    "username": "string",
    "email": "string"
  },
  "access_token": "jwt-token-string"
}

Error Response(s):

400 Bad Request: Invalid input.

{
  "error": "Invalid input."
}

409 Conflict: If username or email already exists.

{
  "error": "User already exists."
}

Feature: User Login
HTTP Method: POST

Endpoint Path: /api/auth/login

Description: Authenticates a user and issues an authentication token.

Request Body:

{
  "identifier": "string",
  "password": "string"
}

Success Response (200 OK):

{
  "message": "Login successful.",
  "access_token": "jwt-token-string"
}

Error Response(s):

401 Unauthorized: If credentials are incorrect.

{
  "error": "Authentication failed."
}

Feature: Retrieve Current User Profile
HTTP Method: GET

Endpoint Path: /api/users/me

Description: Retrieves the authenticated user's core profile and associated privacy data.

Request Body: None

Success Response (200 OK):

{
  "user": {
    "id": "uuid-string",
    "username": "string",
    "email": "string"
  },
  "user_profile": {
    "privacy_score": 75,
    "privacy_preferences": {
      "receive_alerts": true,
      "personalized_tips_enabled": true
    }
  }
}

Error Response(s):

401 Unauthorized: If the token is missing or invalid.

Feature: Update Current User Profile
HTTP Method: PATCH

Endpoint Path: /api/users/me

Description: Updates the authenticated user's profile information or privacy preferences.

Request Body:

{
  "username": "string",
  "privacy_preferences": {
    "receive_alerts": "boolean"
  }
}

Success Response (200 OK):

{
  "message": "User profile updated successfully.",
  "user_profile": {
    "privacy_preferences": {
      "receive_alerts": false
    }
  }
}

Error Response(s):

401 Unauthorized: If the token is invalid.

409 Conflict: If a unique field like username is already in use.

2. Data Analysis & Dashboard
Feature: Initiate Data Sharing Analysis
HTTP Method: POST

Endpoint Path: /api/data-analysis/scan

Description: Triggers a backend process to analyze the user's data sharing footprint.

Request Body:

{
  "scan_scope": "string"
}

Success Response (202 Accepted):

{
  "message": "Data analysis scan initiated.",
  "scan_id": "uuid-string"
}

Error Response(s):

401 Unauthorized: If the token is invalid.

429 Too Many Requests: If a scan is already in progress.

Feature: Retrieve Latest Data Analysis Report
HTTP Method: GET

Endpoint Path: /api/data-analysis/reports/latest

Description: Fetches the most recent analysis report for the authenticated user.

Request Body: None

Success Response (200 OK):

{
  "report": {
    "id": "uuid-string",
    "user_id": "uuid-string",
    "analysis_date": "datetime-string",
    "shared_data_summary": { ... }
  }
}

Error Response(s):

401 Unauthorized: If the token is invalid.

404 Not Found: If no reports exist for the user.

3. Alerts & Checklists
Feature: Retrieve All Active Alerts
HTTP Method: GET

Endpoint Path: /api/alerts

Description: Retrieves a paginated list of all active or pending privacy alerts for the authenticated user.

Request Body: None

Success Response (200 OK):

{
  "alerts": [
    {
      "id": "uuid-string",
      "title": "string",
      "severity": "string"
    }
  ],
  "pagination": { "total_items": 15, "limit": 10, "offset": 0 }
}   

Error Response(s):

401 Unauthorized: If the token is invalid.

Feature: Retrieve Specific Checklist
HTTP Method: GET

Endpoint Path: /api/checklists/{id}

Description: Retrieves a specific checklist with all its items and the user's completion status.

Request Body: None

Success Response (200 OK):

{
  "checklist": {
    "id": "uuid-string",
    "title": "string",
    "items": [
      {
        "id": "uuid-string",
        "description": "string",
        "status": "string"
      }
    ]
  }
}

Error Response(s):

401 Unauthorized: If the token is invalid.

404 Not Found: If the checklist doesn't exist.

Feature: Update Checklist Item Status
HTTP Method: PATCH

Endpoint Path: /api/checklists/{checklist_id}/items/{item_id}/status

Description: Updates the completion status of a checklist item for the authenticated user.

Request Body:

{
  "status": "string"
}

Success Response (200 OK):

{
  "message": "Checklist item status updated successfully.",
  "item": {
    "id": "uuid-string",
    "status": "string",
    "last_updated": "datetime-string"
  }
}

Error Response(s):

400 Bad Request: If the status is invalid.

401 Unauthorized: If the token is invalid.

404 Not Found: If the item or checklist doesn't exist.
