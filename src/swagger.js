export const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "YouTube Backend API",
    "description": "API Documentation for the YouTube Backend Clone",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8000/api/v1",
      "description": "Local Development Server"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  },
  "paths": {
    "/users/register": {
      "post": {
        "summary": "Register a new user",
        "tags": ["Users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["fullname", "email", "username", "password"],
                "properties": {
                  "fullname": { "type": "string" },
                  "email": { "type": "string" },
                  "username": { "type": "string" },
                  "password": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "201": { "description": "User registered successfully" },
          "400": { "description": "Bad Request (Missing fields)" },
          "409": { "description": "Conflict (User already exists)" }
        }
      }
    },
    "/users/login": {
      "post": {
        "summary": "Login a user",
        "tags": ["Users"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["password"],
                "properties": {
                  "username": { "type": "string" },
                  "email": { "type": "string" },
                  "password": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "User logged in successfully" },
          "400": { "description": "Bad request" },
          "401": { "description": "Unauthorized (Incorrect password)" },
          "404": { "description": "User not found" }
        }
      }
    },
    "/users/logout": {
      "post": {
        "summary": "Logout a user",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "User logged out" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/refresh-token": {
      "post": {
        "summary": "Refresh Access Token",
        "tags": ["Users"],
        "requestBody": {
          "required": false,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "refreshToken": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Access token refreshed" },
          "401": { "description": "Unauthorized or invalid refresh token" }
        }
      }
    },
    "/users/change-password": {
      "post": {
        "summary": "Change user password",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["oldPassword", "newPassword"],
                "properties": {
                  "oldPassword": { "type": "string" },
                  "newPassword": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "Password changed successfully" },
          "400": { "description": "Bad Request (Incorrect old password)" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/current-user": {
      "get": {
        "summary": "Get current logged in user details",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "Current user fetched successfully" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/update-account": {
      "patch": {
        "summary": "Update user account details (Partial)",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["fullname", "email"],
                "properties": {
                  "fullname": { "type": "string" },
                  "email": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "User details updated successfully" },
          "400": { "description": "Bad request" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/replace-account": {
      "put": {
        "summary": "Replace user account details (Full)",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["fullname", "email", "username"],
                "properties": {
                  "fullname": { "type": "string" },
                  "email": { "type": "string" },
                  "username": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "description": "User details replaced successfully" },
          "400": { "description": "Bad request" },
          "401": { "description": "Unauthorized" }
        }
      }
    },
    "/users/delete-account": {
      "delete": {
        "summary": "Delete user account",
        "tags": ["Users"],
        "security": [{ "bearerAuth": [] }],
        "responses": {
          "200": { "description": "User account deleted successfully" },
          "401": { "description": "Unauthorized" }
        }
      }
    }
  }
};
