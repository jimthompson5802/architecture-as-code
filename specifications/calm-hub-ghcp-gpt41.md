# CALM Hub Formal Specification

created with `ghcp` using gpt-4.1.  First used `Plan` mode with this [prompt](./reverse-engineer-spec-prompt.md) 


## 1. System Overview

**Purpose:**
CALM Hub is a backend service for managing, versioning, and securing software architecture models and related domain concepts in regulated environments (e.g., financial services). It provides REST APIs for CRUD operations on architectures, domains, and user access, supporting both MongoDB and embedded NitriteDB for persistence.

**Key Capabilities:**
- Namespace-based management of architecture models (CRUD, versioning)
- Domain management (logical grouping of controls/schemas)
- Fine-grained user access control per namespace/resource
- Pluggable storage (MongoDB, NitriteDB)
- OpenAPI/Swagger UI documentation
- Secure mode with Keycloak integration

**Primary Users/Actors:**
- System administrators (manage domains, user access)
- Architects/engineers (manage architectures)
- Application clients (integrate via REST API)

## 2. User Stories

### Architecture Management
- As an architect, I want to create a new architecture in a namespace, so that I can manage its lifecycle and versions.
- As an architect, I want to retrieve all architectures in a namespace, so that I can view and select them for editing or review.
- As an architect, I want to create a new version of an architecture, so that I can track changes over time.
- As an architect, I want to update an existing architecture version (if allowed), so that I can correct or enhance models.
- As an architect, I want to retrieve a specific version of an architecture, so that I can review historical states.

### Domain Management
- As an admin, I want to create a new domain, so that I can logically group controls and schemas.
- As a user, I want to list all available domains, so that I can understand the organizational structure.

### User Access Management
- As an admin, I want to grant user access to a namespace/resource, so that I can control permissions.
- As an admin, I want to view all user access records for a namespace, so that I can audit and manage permissions.
- As an admin, I want to retrieve a specific user access record by ID, so that I can review or revoke access.

## 3. Acceptance Criteria

### Architecture Management
#### Create Architecture
- **Given** a valid namespace and architecture details
- **When** a POST is made to `/calm/namespaces/{namespace}/architectures`
- **Then** a new architecture is created with version 1.0.0 and a unique ID
- **And** the response includes a location header for the new resource
- **Edge:** If the namespace does not exist, return 404
- **Edge:** If the architecture JSON is invalid, return 400

#### Retrieve Architectures
- **Given** a valid namespace
- **When** a GET is made to `/calm/namespaces/{namespace}/architectures`
- **Then** a list of architectures is returned
- **Edge:** If the namespace does not exist, return 404

#### Create Architecture Version
- **Given** a valid architecture ID and version
- **When** a POST is made to `/calm/namespaces/{namespace}/architectures/{architectureId}/versions/{version}`
- **Then** a new version is created
- **Edge:** If version exists, return 409
- **Edge:** If architecture or namespace does not exist, return 404

#### Update Architecture Version
- **Given** PUT operations are enabled
- **When** a PUT is made to `/calm/namespaces/{namespace}/architectures/{architectureId}/versions/{version}`
- **Then** the architecture is updated
- **Edge:** If PUT is disabled, return 403
- **Edge:** If not found, return 404

### Domain Management
#### Create Domain
- **Given** a unique domain name
- **When** a POST is made to `/calm/domains`
- **Then** the domain is created
- **Edge:** If domain exists, return 409

#### List Domains
- **Given** domains exist
- **When** a GET is made to `/calm/domains`
- **Then** a list of domains is returned

### User Access Management
#### Create User Access
- **Given** a valid namespace and user access details
- **When** a POST is made to `/calm/namespaces/{namespace}/user-access`
- **Then** user access is created
- **Edge:** If namespace mismatch, return 400
- **Edge:** If namespace not found, return 404

#### List User Access
- **Given** a valid namespace
- **When** a GET is made to `/calm/namespaces/{namespace}/user-access`
- **Then** a list of user access records is returned
- **Edge:** If namespace not found, return 404

#### Get User Access by ID
- **Given** a valid namespace and userAccessId
- **When** a GET is made to `/calm/namespaces/{namespace}/user-access/{userAccessId}`
- **Then** the user access record is returned
- **Edge:** If not found, return 404

## 4. Functional Requirements

### Architecture Management
- CRUD operations for architectures within namespaces
- Versioning support for architectures
- Validation of namespace and version formats
- Error handling for not found, conflict, and bad request scenarios

### Domain Management
- CRUD operations for domains
- Validation of domain name format and uniqueness

### User Access Management
- CRUD operations for user access per namespace/resource
- Validation of namespace and user access details
- Support for permission types (read, write) and resource types (patterns, flows, adrs, architectures, all)

## 5. Technical Requirements
- Java 21, Quarkus 3.29+, Maven
- RESTful API (JAX-RS), OpenAPI/Swagger UI
- MongoDB (default) and NitriteDB (standalone) storage
- CDI for dependency injection, producer pattern for store selection
- Keycloak integration for secure profile
- JUnit 5, TestContainers for testing
- Error handling via custom exceptions and response mappers
- Configurable via Quarkus profiles and environment variables
- Docker support for deployment

## 6. Data Model

### Architecture
- namespace: String
- id: int
- version: String (dot/hyphen format)
- name: String
- description: String
- architecture: String (JSON)

### Domain
- name: String (validated, unique)

### UserAccess
- username: String
- permission: Enum (read, write)
- namespace: String
- resourceType: Enum (patterns, flows, adrs, architectures, all)
- userAccessId: int
- creationDateTime: LocalDateTime
- updateDateTime: LocalDateTime

## 7. Non-Functional Requirements (Inferred)
- Performance: Should support concurrent API usage and efficient storage access
- Security: Role-based access via Keycloak, secure profile, input validation
- Reliability: Error handling for all edge cases, integration tests with TestContainers
- Scalability: Pluggable storage, Dockerized deployment, multi-arch builds

## 8. Ambiguities and Gaps
- No explicit pagination or filtering for list endpoints (ValueWrapper hints at future support)
- No explicit audit logging or change history beyond versioning
- No details on soft/hard delete semantics
- No explicit rate limiting or API throttling
- No details on maximum field lengths or payload sizes
- No explicit support for bulk operations

## 9. Improvement Opportunities
- Add pagination and filtering to list endpoints
- Enhance error responses with standardized error objects
- Add audit logging for sensitive operations
- Document field constraints and validation rules in OpenAPI spec
- Consider supporting soft deletes and recovery
- Add support for bulk operations (batch create/update)
