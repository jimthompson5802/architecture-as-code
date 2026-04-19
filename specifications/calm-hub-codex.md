# `calm-hub` Reverse-Engineered Specification

created with `codex` using gpt-5.4 (High Reasoning).  First used `Plan` mode with this [prompt](./reverse-engineer-spec-prompt.md) 

## Document Status
- Scope: `calm-hub` backend service, runtime/deployment behavior, and packaged UI serving behavior.
- Exclusions: Reverse engineering of `calm-hub-ui` source internals.
- Evidence base: `resources/`, `domain/`, `store/`, `security/`, `config/`, `application.properties`, `application-secure.properties`, `README.md`, `AGENTS.md`, unit tests, and integration tests.
- Interpretation rule:
  - `Observed` means directly supported by code or tests.
  - `Inferred` means a reasonable product or architectural interpretation derived from naming, structure, or persistence behavior.

## 1. System Overview

### Purpose of the System
- Observed: `calm-hub` is a Quarkus-based REST service that stores and retrieves CALM-related assets under namespaces and domains.
- Observed: The service manages versioned architectures, patterns, flows, standards, interfaces, decorators, core schemas, user-access grants, and architecture decision records (ADRs).
- Inferred: The system acts as a central repository and governance hub for CALM artifacts used by architecture, engineering, and control/governance stakeholders.
- Observed: The module also packages and serves a built frontend as part of the application runtime, but the frontend source is outside this specification boundary.

### Key Capabilities
- Observed: Create and list namespaces.
- Observed: Create and list domains.
- Observed: Create, version, retrieve, and optionally update CALM artifacts:
  - architectures
  - patterns
  - flows
  - standards
  - interfaces
- Observed: Retrieve the latest flow version directly.
- Observed: Create, revise, retrieve, and change status of ADRs.
- Observed: Create and retrieve control requirements and control configurations within domains.
- Observed: Create, update, retrieve, and filter decorators.
- Observed: Publish and retrieve core CALM schema versions and schema metadata.
- Observed: Create and retrieve namespace-scoped user-access grants.
- Observed: Resolve human-readable custom IDs to versioned resources through a front-controller API.
- Observed: Support two storage backends selected at runtime:
  - MongoDB mode
  - standalone NitriteDB mode
- Observed: Support a secure profile with OIDC authentication and additional access validation.

### Primary Users or Actors
- Inferred: Architecture authors who publish and version CALM architectures, patterns, flows, standards, and interfaces.
- Inferred: Governance and control teams who maintain domains, controls, schemas, decorators, and standards.
- Inferred: Decision-makers and reviewers who create and evolve ADRs.
- Inferred: Namespace administrators who manage namespace-specific access grants.
- Observed: API clients and automation tools that integrate through REST endpoints.
- Inferred: Platform operators who deploy the service in MongoDB-backed or standalone mode and optionally enable secure mode.

## 2. User Stories

### Namespaces and Domains
- Inferred, US-ND-1: As an architecture platform administrator, I want to create a namespace, so that related CALM assets can be isolated and managed together.
- Inferred, US-ND-2: As an authenticated user with read access, I want to list namespaces, so that I can discover available CALM repositories.
- Inferred, US-ND-3: As a governance administrator, I want to create a domain, so that controls can be organized under a stable governance boundary.
- Inferred, US-ND-4: As a governance user, I want to list domains, so that I can discover where controls are maintained.

### Versioned CALM Artifacts
- Inferred, US-VA-1: As an architecture author, I want to create a new architecture, pattern, flow, standard, or interface in a namespace, so that the hub can assign a canonical numeric ID and initial version.
- Inferred, US-VA-2: As a consumer, I want to list artifacts in a namespace, so that I can browse available reusable assets.
- Inferred, US-VA-3: As a consumer, I want to list versions of an artifact, so that I can choose a specific release.
- Inferred, US-VA-4: As a consumer, I want to retrieve a specific artifact version, so that I can use a stable, reproducible representation.
- Inferred, US-VA-5: As an author, I want to create a new version of an existing artifact, so that I can evolve it without replacing history.
- Inferred, US-VA-6: As an operator of a mutable repository, I want to update an existing artifact version with PUT when enabled, so that correction workflows are possible in selected deployments.
- Inferred, US-VA-7: As a flow consumer, I want to retrieve the latest flow version directly, so that I can avoid separate version discovery for common read paths.

### Controls
- Inferred, US-CT-1: As a governance author, I want to create a control requirement in a domain, so that the control exists with an initial requirement definition.
- Inferred, US-CT-2: As a governance user, I want to list controls in a domain, so that I can discover available controls.
- Inferred, US-CT-3: As a governance user, I want to list and retrieve versions of a control requirement, so that I can audit requirement history.
- Inferred, US-CT-4: As a governance author, I want to create configurations under a control and version those configurations, so that implementation patterns can evolve independently from the control requirement.

### Decorators
- Inferred, US-DC-1: As an architecture author, I want to create decorators in a namespace, so that I can attach supplemental metadata to CALM resources.
- Inferred, US-DC-2: As a consumer, I want to retrieve decorator IDs or full decorator values with filters, so that I can find relevant decorators by target or type.
- Inferred, US-DC-3: As an editor, I want to update an existing decorator by ID, so that I can correct or refine attached metadata.

### ADRs
- Inferred, US-ADR-1: As an architect, I want to create an ADR in draft state, so that important decisions can be recorded from their first revision.
- Inferred, US-ADR-2: As an architect, I want each ADR update to create a new revision, so that the decision history remains auditable.
- Inferred, US-ADR-3: As a reviewer, I want to retrieve the latest ADR or a specific revision, so that I can inspect the current and historical decision record.
- Inferred, US-ADR-4: As a decision owner, I want to update ADR status, so that the ADR lifecycle can move from draft toward accepted or other states.

### Core Schema Registry
- Inferred, US-SC-1: As a platform maintainer, I want to publish a schema version with named schemas, so that clients can retrieve the authoritative CALM schema bundle for a release.
- Inferred, US-SC-2: As a consumer, I want to list schema versions and schema names, so that I can discover available schema contracts.
- Inferred, US-SC-3: As a consumer, I want to retrieve a specific schema by version and name, so that validation or tooling can use the exact expected schema.

### Custom-ID Front Controller
- Inferred, US-FC-1: As an API client, I want to create or update resources using a human-readable custom ID, so that I do not need to manage numeric resource IDs directly.
- Inferred, US-FC-2: As an API client, I want semantic-version increments to be computed from change type, so that versioning is predictable.
- Inferred, US-FC-3: As a consumer, I want to resolve a custom ID to the latest resource, a specific version, or a version list, so that friendly identifiers can be used in integrations.
- Inferred, US-FC-4: As an administrator or integrator, I want to query mappings by namespace, type, and numeric ID, so that friendly and numeric identifiers can be cross-referenced.

### User Access and Secure Profile
- Inferred, US-AC-1: As a namespace administrator, I want to grant user access in a namespace, so that authorized users can read or write only what they need.
- Inferred, US-AC-2: As a namespace administrator, I want to retrieve namespace access grants, so that I can audit permissions.
- Inferred, US-AC-3: As a secured API client, I want requests to require matching scopes and namespace access grants, so that protected resources are not exposed to unauthorized users.

### Storage Modes and Runtime
- Inferred, US-RT-1: As a platform operator, I want to run the hub against MongoDB or in standalone embedded mode, so that the deployment model can match the environment.
- Inferred, US-RT-2: As a developer, I want OpenAPI/Swagger, Quarkus dev mode, and packaged delivery, so that development and deployment are straightforward.

## 3. Acceptance Criteria

### Namespaces and Domains

#### US-ND-1 Create namespace
- Observed:
  - Given a valid namespace request with `name` and `description`
  - When the client `POST`s to `/calm/namespaces`
  - Then the service returns `201 Created`
  - And the `Location` header points to `/calm/namespaces/{name}`
- Observed:
  - Given the request body is null
  - When the client `POST`s to `/calm/namespaces`
  - Then the service returns `400 Bad Request`
- Observed:
  - Given `name` is blank, null, or violates the namespace regex
  - When the client creates a namespace
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace already exists
  - When the client creates the same namespace again
  - Then the service returns `409 Conflict`

#### US-ND-2 List namespaces
- Observed:
  - Given namespaces exist
  - When the client `GET`s `/calm/namespaces`
  - Then the service returns `200 OK`
  - And the response body is a `ValueWrapper` with `values`
- Observed:
  - Given no namespaces exist
  - When the client lists namespaces
  - Then the service still returns `200 OK`
  - And `values` is empty

#### US-ND-3 Create domain
- Observed:
  - Given a valid domain name
  - When the client `POST`s to `/calm/domains`
  - Then the service returns `201 Created`
  - And the `Location` header points to `/calm/domains/{domain}`
- Observed:
  - Given the domain name contains invalid characters such as whitespace
  - When the client creates the domain
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the domain already exists
  - When the client creates the same domain again
  - Then the service returns `409 Conflict`

#### US-ND-4 List domains
- Observed:
  - Given domains exist or do not exist
  - When the client `GET`s `/calm/domains`
  - Then the service returns `200 OK`
  - And the response is wrapped in `ValueWrapper`

### Versioned CALM Artifacts

#### US-VA-1 Create initial artifact version
- Observed:
  - Given a valid namespace and valid creation payload
  - When the client `POST`s a new architecture, pattern, flow, standard, or interface to its collection endpoint
  - Then the service returns `201 Created`
  - And the created resource is assigned a numeric ID
  - And the initial version is `1.0.0`
- Observed:
  - Given the namespace path parameter is syntactically invalid
  - When the client creates the artifact
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace format is valid but does not exist
  - When the client creates the artifact
  - Then the service returns `404 Not Found`
- Observed:
  - Given the JSON payload for pattern, architecture, flow, decorator, or interface parsing is invalid
  - When the client creates the resource
  - Then the service returns `400 Bad Request`
- Observed:
  - Given some artifact request models omit bean validation on fields
  - When incomplete but structurally parseable requests are sent
  - Then validation behavior is resource-specific rather than uniform

#### US-VA-2 List artifacts in a namespace
- Observed:
  - Given a valid namespace
  - When the client lists artifacts in that namespace
  - Then the service returns `200 OK`
  - And each item is returned as a summary DTO with `id` plus `name` and `description` where applicable
- Observed:
  - Given the namespace path parameter is invalid
  - When the client performs the list request
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace is missing from storage
  - When the client performs the list request
  - Then the service returns `404 Not Found`

#### US-VA-3 List artifact versions
- Observed:
  - Given a valid namespace and existing artifact ID
  - When the client requests the versions endpoint
  - Then the service returns `200 OK`
  - And `values` contains version strings
- Observed:
  - Given the namespace is invalid
  - When the client lists versions
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace or artifact does not exist
  - When the client lists versions
  - Then the service returns `404 Not Found`

#### US-VA-4 Retrieve a specific artifact version
- Observed:
  - Given a valid namespace, artifact ID, and version
  - When the client requests that version
  - Then the service returns `200 OK`
  - And the response body contains raw JSON for the artifact
- Observed:
  - Given the version format is invalid
  - When the client requests the version
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace, artifact, or version does not exist
  - When the client requests the version
  - Then the service returns `404 Not Found`

#### US-VA-5 Create a new artifact version
- Observed:
  - Given a valid namespace, artifact ID, target version, and payload
  - When the client `POST`s to the version creation endpoint
  - Then the service returns `201 Created`
  - And the `Location` header points to the created version
- Observed:
  - Given the version already exists
  - When the client creates it again
  - Then the service returns `409 Conflict`
- Observed:
  - Given the namespace or artifact does not exist
  - When the client creates the new version
  - Then the service returns `404 Not Found`
- Observed:
  - Given the namespace or version path parameter is invalid
  - When the client creates the version
  - Then the service returns `400 Bad Request`

#### US-VA-6 Update an existing artifact version with PUT
- Observed:
  - Given `allow.put.operations=false` or omitted
  - When the client `PUT`s to a mutable artifact endpoint
  - Then the service returns `403 Forbidden`
- Observed:
  - Given `allow.put.operations=true`
  - When the client `PUT`s a valid update for architecture, pattern, or flow
  - Then the service returns `201 Created`
  - And the `Location` header points to the updated version URI
- Observed:
  - Given the namespace, version format, or resource is invalid
  - When the client uses `PUT`
  - Then the service returns `400` or `404` depending on failure type

#### US-VA-7 Retrieve latest flow version
- Observed:
  - Given a flow exists with one or more versions
  - When the client `GET`s `/calm/namespaces/{namespace}/flows/{flowId}`
  - Then the service returns the latest version content
- Observed:
  - Given the flow does not exist or the namespace is invalid
  - When the latest-flow endpoint is called
  - Then the service returns `404 Not Found`

### Controls

#### US-CT-1 Create control requirement
- Observed:
  - Given a valid domain and a valid `CreateControlRequirement`
  - When the client `POST`s to `/calm/domains/{domain}/controls`
  - Then the service returns `201 Created`
  - And the response body contains a `ControlDetail`
- Observed:
  - Given the domain path parameter format is invalid
  - When the client creates the control
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the domain does not exist
  - When the client creates the control
  - Then the service returns `404 Not Found`

#### US-CT-2 List controls
- Observed:
  - Given a valid domain
  - When the client `GET`s `/calm/domains/{domain}/controls`
  - Then the service returns `200 OK`
  - And the response is wrapped in `ValueWrapper`

#### US-CT-3 Retrieve requirement versions and content
- Observed:
  - Given a valid domain and control
  - When the client retrieves requirement versions or a specific version
  - Then the service returns `200 OK`
- Observed:
  - Given the version format is invalid
  - When the client retrieves a specific requirement version
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the domain, control, or version does not exist
  - When the client retrieves requirement history or content
  - Then the service returns `404 Not Found`

#### US-CT-4 Create and version control configurations
- Observed:
  - Given a valid domain, control, and configuration payload
  - When the client creates a configuration
  - Then the service returns `201 Created`
  - And a numeric configuration ID is assigned
- Observed:
  - Given a valid domain, control, configuration ID, and version
  - When the client creates a configuration version
  - Then the service returns `201 Created`
- Observed:
  - Given the version already exists
  - When the client creates the same configuration version again
  - Then the service returns `409 Conflict`
- Observed:
  - Given the configuration JSON is invalid or the target resources do not exist
  - When the client creates the configuration version
  - Then the service returns `400` or `404` as appropriate

### Decorators

#### US-DC-1 Create decorator
- Observed:
  - Given a valid namespace and well-formed decorator JSON
  - When the client `POST`s to `/calm/namespaces/{namespace}/decorators`
  - Then the service returns `201 Created`
  - And the body contains the assigned numeric decorator ID
- Observed:
  - Given the decorator JSON is invalid
  - When the client creates the decorator
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace does not exist
  - When the client creates the decorator
  - Then the service returns `404 Not Found`

#### US-DC-2 Retrieve and filter decorators
- Observed:
  - Given a valid namespace
  - When the client requests `/decorators` or `/decorators/values`
  - Then the service returns `200 OK`
  - And optional `target` and `type` filters may be applied
- Observed:
  - Given `target` or `type` query parameters contain whitespace or exceed limits
  - When the client performs the request
  - Then the service returns `400 Bad Request`
- Observed:
  - Given an individual decorator ID does not exist
  - When the client `GET`s `/decorators/{id}`
  - Then the service returns `404 Not Found`

#### US-DC-3 Update decorator
- Observed:
  - Given a valid namespace, decorator ID, and valid JSON
  - When the client `PUT`s to `/decorators/{id}`
  - Then the service returns `200 OK`
- Observed:
  - Given the namespace or decorator does not exist, or the JSON is invalid
  - When the client updates the decorator
  - Then the service returns `404` or `400`

### ADRs

#### US-ADR-1 Create ADR
- Observed:
  - Given a valid namespace and ADR request
  - When the client `POST`s to `/calm/namespaces/{namespace}/adrs`
  - Then the service returns `201 Created`
  - And the first revision is `1`
  - And the ADR status is initialized to `draft`
- Observed:
  - Given the namespace does not exist
  - When the ADR is created
  - Then the service returns `404 Not Found`

#### US-ADR-2 Update ADR and create a new revision
- Observed:
  - Given an existing ADR and valid update request
  - When the client `POST`s to `/calm/namespaces/{namespace}/adrs/{adrId}`
  - Then the service returns `201 Created`
  - And a new revision is created rather than overwriting history
- Observed:
  - Given the namespace or ADR does not exist
  - When the update request is made
  - Then the service returns `404 Not Found`

#### US-ADR-3 Retrieve latest ADR, revision list, or specific revision
- Observed:
  - Given the ADR exists
  - When the client retrieves the latest ADR, its revisions, or a specific revision
  - Then the service returns `200 OK`
- Observed:
  - Given the ADR or revision is missing
  - When the client requests it
  - Then the service returns `404 Not Found`

#### US-ADR-4 Update ADR status
- Observed:
  - Given an existing ADR and valid enum status
  - When the client `POST`s to `/status/{status}`
  - Then the service returns `201 Created`
  - And a new ADR revision is created
- Observed:
  - Given the ADR or namespace does not exist
  - When the status change is requested
  - Then the service returns `404 Not Found`

### Core Schema Registry

#### US-SC-1 Publish schema version
- Observed:
  - Given a request with a non-empty `version` and non-empty `schemas` map
  - When the client `POST`s to `/calm/schemas`
  - Then the service returns `201 Created`
  - And the `Location` header points to `/calm/schemas/{version}/meta`
- Observed:
  - Given `version` is missing, blank, or only whitespace
  - When the client publishes the schema version
  - Then the service returns `400 Bad Request`
- Observed:
  - Given `schemas` is missing or empty
  - When the client publishes the schema version
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the schema version already exists
  - When the client publishes the same version again
  - Then the service returns `409 Conflict`

#### US-SC-2 List schema versions and schema names
- Observed:
  - Given schemas may or may not exist
  - When the client `GET`s `/calm/schemas`
  - Then the service returns `200 OK`
  - And the result is wrapped in `ValueWrapper`
- Observed:
  - Given a schema version exists
  - When the client `GET`s `/calm/schemas/{version}/meta`
  - Then the service returns `200 OK`
  - And `values` contains schema names
- Observed:
  - Given the version does not exist
  - When the client requests the schema-name list
  - Then the service returns `404 Not Found`

#### US-SC-3 Retrieve specific schema
- Observed:
  - Given the version and schema name exist
  - When the client requests `/calm/schemas/{version}/meta/{schemaName}`
  - Then the service returns `200 OK`
  - And the raw schema object is returned
- Observed:
  - Given the version or schema name does not exist
  - When the client requests the schema
  - Then the service returns `404 Not Found`

### Custom-ID Front Controller

#### US-FC-1 Create resource by custom ID
- Observed:
  - Given no mapping exists for `{namespace}/{customId}`
  - And the request body contains `type` and `json`
  - When the client `POST`s to `/calm/namespaces/{namespace}/{customId}`
  - Then the service creates a resource at version `1.0.0`
  - And reserves and then updates a mapping from custom ID to numeric ID
  - And returns `201 Created`
- Observed:
  - Given `customId` violates the lowercase kebab-case rule
  - When the client uses the endpoint
  - Then the service returns `400 Bad Request`
- Observed:
  - Given `type` is missing or invalid
  - When the client creates the resource
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the mapping already exists
  - When the client attempts a conflicting create
  - Then the service returns `409 Conflict`

#### US-FC-2 Update resource by custom ID
- Observed:
  - Given a mapping already exists
  - And the body contains `json` and `changeType`
  - When the client `POST`s to the same custom-ID endpoint
  - Then the service creates a new artifact version
  - And the new semantic version is computed from the latest version and `changeType`
- Observed:
  - Given `changeType` is missing or unparseable
  - When the update request is sent
  - Then the service returns `400 Bad Request`

#### US-FC-3 Resolve latest, specific version, and version history
- Observed:
  - Given a mapping exists
  - When the client `GET`s `/calm/namespaces/{namespace}/{customId}`
  - Then the latest version is resolved and returned
- Observed:
  - Given the client requests `/versions/{version}`
  - When the mapping and version exist
  - Then the service returns that specific version
- Observed:
  - Given the client requests `/versions`
  - When mappings and versions exist
  - Then the service returns versions sorted by semantic version
- Observed:
  - Given `calm.hub.base-url` is configured
  - When the resolved JSON root is an object
  - Then the service rewrites `$id` to the friendly URL
- Observed:
  - Given the mapping is missing
  - When any custom-ID GET endpoint is requested
  - Then the service returns `404 Not Found`

#### US-FC-4 Query mappings
- Observed:
  - Given a valid namespace
  - When the client requests `/calm/namespaces/{namespace}/mappings`
  - Then the service returns all mappings in `ValueWrapper`
- Observed:
  - Given `type` is supplied
  - When the client queries mappings
  - Then the results are filtered by resource type
- Observed:
  - Given `id` is supplied without `type`
  - When the client queries mappings
  - Then the service returns `400 Bad Request`

### User Access and Secure Profile

#### US-AC-1 Create user access grant
- Observed:
  - Given the path namespace matches the body namespace and the namespace exists
  - When the client `POST`s to `/calm/namespaces/{namespace}/user-access`
  - Then the service returns `201 Created`
  - And timestamps are assigned by the server
- Observed:
  - Given the body namespace differs from the path namespace
  - When the create request is made
  - Then the service returns `400 Bad Request`
- Observed:
  - Given the namespace does not exist
  - When the create request is made
  - Then the service returns `404 Not Found`
- Observed:
  - Given URI creation fails unexpectedly
  - When the create request is processed
  - Then the service returns `500 Internal Server Error`

#### US-AC-2 Retrieve user access grants
- Observed:
  - Given namespace access records exist
  - When the client lists namespace access grants or fetches one by ID
  - Then the service returns `200 OK`
- Observed:
  - Given no access grants exist
  - When the client queries them
  - Then the service returns `404 Not Found`

#### US-AC-3 Secure profile authorization
- Observed:
  - Given the `secure` profile is enabled
  - When a protected request is made
  - Then the JWT must contain one of the scopes declared by `@PermittedScopes`
- Observed:
  - Given scope validation fails
  - When the request is processed
  - Then the service returns `403 Forbidden`
- Observed:
  - Given scope validation passes
  - When the request targets a namespace resource
  - Then `UserAccessValidator` checks the username, namespace, path, and mapped permission
- Observed:
  - Given the request is `GET /calm/namespaces`
  - When the secure validator runs
  - Then authenticated users are allowed by default without namespace-specific access grants

### Storage Modes and Runtime

#### US-RT-1 Select MongoDB or standalone mode
- Observed:
  - Given `calm.database.mode=mongo`
  - When the application starts
  - Then MongoDB-backed stores are produced and Mongo indexes are initialized
- Observed:
  - Given `calm.database.mode=standalone`
  - When the application starts
  - Then a Nitrite database is created under the configured data directory
  - And standalone stores are produced

#### US-RT-2 Runtime and developer experience
- Observed:
  - Given development mode is used
  - When the service runs under Quarkus dev mode
  - Then Swagger UI is available and hot reload is supported
- Observed:
  - Given the Maven build runs successfully
  - When packaging occurs
  - Then a runnable Quarkus application is produced
  - And the frontend build is included as part of packaging

## 4. Functional Requirements

### Namespaces and Domains
- Observed: The system shall expose `/calm/namespaces` for listing and creation of namespaces.
- Observed: The system shall expose `/calm/domains` for listing and creation of domains.
- Observed: Namespace names shall match `^[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*$`.
- Observed: Domain names shall match `^[A-Za-z0-9-]+$`.
- Observed: Namespace creation shall trim `name` and `description` before persistence.
- Observed: Namespace creation shall reject duplicate namespace names with `409 Conflict`.
- Observed: Domain creation shall reject duplicate domain names with `409 Conflict`.

### Versioned CALM Artifacts
- Observed: The system shall manage five namespace-scoped versioned artifact families through dedicated endpoints:
  - architectures
  - patterns
  - flows
  - standards
  - interfaces
- Observed: On initial creation, the service shall allocate a numeric ID and initialize version `1.0.0`.
- Observed: Artifact list endpoints shall return summary DTOs in `ValueWrapper`.
- Observed: Artifact version list endpoints shall return a list of version strings in `ValueWrapper`.
- Observed: Artifact retrieval endpoints shall return raw JSON payloads rather than a wrapper DTO.
- Observed: Version path parameters shall match `^(0|[1-9][0-9]*)[-.]?(0|[1-9][0-9]*)[-.]?(0|[1-9][0-9]*)$`.
- Observed: Pattern, architecture, and flow resources support `PUT` update endpoints, but those endpoints are disabled unless `allow.put.operations=true`.
- Observed: Standards and interfaces support POST-based version creation but do not expose PUT update endpoints.
- Observed: Flow resources additionally expose a latest-version read endpoint without requiring the client to specify the version.
- Inferred: Numeric IDs are intended as internal canonical identifiers while versions represent immutable or quasi-immutable snapshots, depending on deployment configuration.

### Controls
- Observed: Controls are domain-scoped rather than namespace-scoped.
- Observed: Creating a control creates a control requirement first and returns a `ControlDetail`.
- Observed: Each control requirement supports:
  - version listing
  - version retrieval
  - new version creation
- Observed: Each control may also have configurations, each with:
  - configuration creation
  - version listing
  - version retrieval
  - new version creation
- Observed: Requirement and configuration JSON creation endpoints accept raw JSON strings for version creation operations.
- Inferred: Requirements define the normative control statement, while configurations represent possible implementation variants.

### Decorators
- Observed: Decorators are namespace-scoped resources identified by numeric decorator IDs.
- Observed: Decorators can be listed either as IDs or as full decorator values.
- Observed: Decorator list endpoints support filtering by optional `target` and `type` query parameters.
- Observed: Query filters shall reject whitespace and overlong values.
- Observed: Decorator updates operate in-place by ID using `PUT`.
- Inferred: Decorators are intended as attachable metadata overlays for CALM resources or related elements.

### ADRs
- Observed: ADRs are namespace-scoped and revision-based rather than semver-based.
- Observed: ADR creation initializes status to `draft`.
- Observed: ADR creation sets creation and update timestamps.
- Observed: ADR updates create new revisions rather than mutating prior revisions.
- Observed: ADR status changes also create new revisions.
- Observed: ADR content fields include title, problem statement, decision drivers, options, decision outcome, links, and status.
- Observed: `NewAdrRequest` sanitizes rich-text-capable string fields before storage.

### Core Schema Registry
- Observed: The system shall expose `/calm/schemas` for version discovery and publication.
- Observed: A schema version consists of a version string and a map of named schemas.
- Observed: The system shall reject schema version creation when version is blank or schemas are missing/empty.
- Observed: The system shall reject duplicate schema version creation with `409 Conflict`.
- Inferred: The schema registry is intended to publish authoritative CALM schema bundles to clients and tooling.

### Custom-ID Front Controller
- Observed: The front-controller API lives under `/calm/namespaces/{namespace}/{customId}`.
- Observed: `customId` values shall match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`.
- Observed: The first POST for a custom ID creates a new resource with required `type` and `json`.
- Observed: Subsequent POSTs for the same custom ID require `changeType` and `json` and create a new semantic version.
- Observed: Supported resource types are:
  - `PATTERN`
  - `ARCHITECTURE`
  - `FLOW`
  - `STANDARD`
  - `INTERFACE`
- Observed: The service persists a mapping from `(namespace, customId)` to `(resourceType, numericId)`.
- Observed: On create, the mapping is reserved before artifact creation and rolled back if artifact creation fails.
- Observed: The service can:
  - return the latest version by custom ID
  - return a specific version by custom ID
  - return semantic version history by custom ID
  - list mappings by namespace
  - resolve mappings by type and numeric ID
- Observed: If `calm.hub.base-url` is configured and the resource JSON is an object, the service rewrites the top-level `$id` field to the friendly URL.

### User Access and Secure Profile
- Observed: User-access records are namespace-scoped and include username, permission, resource type, and timestamps.
- Observed: User-access management endpoints require `namespace:admin` scope.
- Observed: In the secure profile, requests to `/calm/*` require authentication over HTTPS.
- Observed: Resource methods declare acceptable scopes with `@PermittedScopes`.
- Observed: `AccessControlFilter` enforces both:
  - scope presence in the JWT
  - namespace/resource access through `UserAccessValidator`
- Observed: `UserAccessValidator` maps methods to logical actions:
  - `GET` and other non-mutating verbs map to `read`
  - `POST`, `PUT`, `PATCH`, `DELETE` map to `write`
- Observed: `write` permission implies read access.
- Observed: `UserAccess.ResourceType` values are `patterns`, `flows`, `adrs`, `architectures`, and `all`.
- Observed: Authorization matching currently relies in part on substring matching between request path and resource type name.

### Storage Modes and Runtime
- Observed: Store implementations are selected through CDI producers based on `calm.database.mode`.
- Observed: Mongo mode is the default.
- Observed: Standalone mode uses Nitrite with a local file under `${user.home}/.calm-hub/data` by default.
- Observed: Mongo mode creates unique indexes at startup for duplicate prevention on key collections.
- Observed: Nitrite mode uses application-level locking for duplicate prevention where unique indexes are unavailable.
- Observed: The secure profile uses TLS, disables insecure requests, and points OIDC to Keycloak.
- Observed: OpenAPI/Swagger is always included.
- Observed: The Maven build installs Node `v22.15.0` and npm `11.3.0` and runs `npm run calm-hub-ui:prod` during packaging.
- Inferred: The backend is expected to be deployable both as a standalone JAR and as a container image.

## 5. Technical Requirements

### Technologies, Frameworks, and Patterns
- Observed: Language: Java 21.
- Observed: Backend framework: Quarkus 3.29+.
- Observed: REST stack: RESTEasy/JAX-RS with JSON-B.
- Observed: Dependency injection: CDI via Quarkus ARC.
- Observed: Validation: Hibernate Validator with Jakarta Bean Validation.
- Observed: API documentation: SmallRye OpenAPI and Swagger UI.
- Observed: JSON processing: JSON-B, Jackson, and BSON parsing where needed.
- Observed: Persistence backends:
  - MongoDB client for production/default mode
  - NitriteDB with MVStore adapter for standalone mode
- Observed: Security:
  - Quarkus OIDC
  - Quarkus Security
  - JWT inspection
  - custom request filter
- Observed: Sanitization:
  - OWASP HTML Sanitizer for strict sanitization
  - specialized ADR request sanitization
- Observed: Testing:
  - JUnit 5
  - RestAssured
  - Mockito
  - Quarkus test support
  - TestContainers for MongoDB and Keycloak integration tests
- Observed: Frontend packaging:
  - `frontend-maven-plugin`
  - Node `v22.15.0`
  - npm `11.3.0`

### Architectural Patterns
- Observed: Resource-oriented REST API with one resource class per major domain.
- Observed: Store abstraction pattern with backend-specific implementations under `store.mongo` and `store.nitrite`.
- Observed: Runtime store selection through producer classes.
- Observed: Versioned artifact pattern with separate endpoints for collection, version list, specific version, and optional update.
- Observed: Revision-based ADR pattern distinct from semver-based artifact pattern.
- Observed: Front-controller indirection pattern for custom human-readable identifiers.
- Inferred: The design favors API stability through explicit identifiers and historical version preservation.

### APIs

#### Namespace and domain APIs
- Observed:
  - `GET /calm/namespaces`
  - `POST /calm/namespaces`
  - `GET /calm/domains`
  - `POST /calm/domains`

#### Artifact APIs
- Observed:
  - `GET|POST /calm/namespaces/{namespace}/architectures`
  - `GET /calm/namespaces/{namespace}/architectures/{id}/versions`
  - `GET|POST|PUT /calm/namespaces/{namespace}/architectures/{id}/versions/{version}`
  - Equivalent collections and version endpoints for patterns and flows
  - `GET|POST /calm/namespaces/{namespace}/standards`
  - `GET /calm/namespaces/{namespace}/standards/{id}/versions`
  - `GET|POST /calm/namespaces/{namespace}/standards/{id}/versions/{version}`
  - `GET|POST /calm/namespaces/{namespace}/interfaces`
  - `GET /calm/namespaces/{namespace}/interfaces/{id}/versions`
  - `GET|POST /calm/namespaces/{namespace}/interfaces/{id}/versions/{version}`

#### Other feature APIs
- Observed:
  - Controls under `/calm/domains/{domain}/controls/...`
  - Decorators under `/calm/namespaces/{namespace}/decorators...`
  - ADRs under `/calm/namespaces/{namespace}/adrs...`
  - Schemas under `/calm/schemas...`
  - User access under `/calm/namespaces/{namespace}/user-access...`
  - Front controller under `/calm/namespaces/{namespace}/{customId}...`

### Data Persistence and Integrations
- Observed: MongoDB mode uses collection-level uniqueness constraints for duplicate prevention.
- Observed: Mongo collections include:
  - `namespaces`
  - `domains`
  - `schemas`
  - `architectures`
  - `patterns`
  - `flows`
  - `standards`
  - `interfaces`
  - `controls`
  - `decorators`
  - `resource_mappings`
- Observed: Nitrite mode creates embedded collections for key resource families and stores the database in a local file.
- Observed: Integration tests use MongoDB TestContainers and a Keycloak test resource.
- Observed: Secure mode integrates with Keycloak over OIDC.

### Constraints
- Observed: PUT mutation is disabled by default and must be explicitly enabled.
- Observed: All secure-profile `/calm/*` routes require authentication.
- Observed: JaCoCo enforces 90 percent line coverage per class, with configured exclusions.
- Observed: The Maven packaging flow depends on Node 22 tooling for the packaged UI build.
- Inferred: Horizontal scaling is safer in Mongo mode than standalone mode because uniqueness is delegated to the database rather than in-process locks.

### Implicit Assumptions and Inferred Design Decisions
- Inferred: Namespaces are the primary multi-tenant partition for most CALM assets.
- Inferred: Domains exist as a separate partition because controls belong to governance domains rather than architecture namespaces.
- Inferred: Raw JSON is preserved for many resources so the service can act as a repository without strongly binding to every schema detail in Java DTOs.
- Inferred: The front-controller exists to provide more stable, human-readable URLs for integration use cases.

## 6. Data Model

### Entity and Relationship Summary
- Observed:
  - A `NamespaceInfo` contains many architectures, patterns, flows, standards, interfaces, decorators, ADRs, user-access records, and custom-ID mappings.
  - A `Domain` contains many controls.
  - A control contains one requirement history and many configurations.
  - A configuration contains many configuration versions.
  - A `ResourceMapping` links one `(namespace, customId)` to one `(resourceType, numericId)`.
  - An `AdrMeta` wraps one ADR content object together with namespace, ADR ID, and revision number.

### Key Entities

#### NamespaceInfo
- Observed fields:
  - `name: String`
  - `description: String`
- Observed validation:
  - `name` is non-null and non-blank in the DTO.

#### NamespaceRequest
- Observed fields:
  - `name: String`
  - `description: String`
- Observed validation:
  - `name` must be non-null, non-blank, and match the namespace regex.
  - `description` must be non-null and non-blank.

#### Domain
- Observed fields:
  - `name: String`
- Observed validation:
  - `name` must be non-null, non-blank, and match the domain regex.

#### Architecture
- Observed fields:
  - `namespace: String`
  - `name: String`
  - `description: String`
  - `id: int`
  - `version: String`
  - `architectureJson: String`
- Observed behavior:
  - Exposes dot version for API use and hyphenated version for Mongo persistence.

#### Pattern
- Observed fields:
  - `namespace: String`
  - `id: int`
  - `version: String`
  - `patternJson: String`

#### Flow
- Observed fields:
  - `namespace: String`
  - `id: int`
  - `version: String`
  - `flowJson: String`

#### Standard
- Observed fields:
  - `standardJson: String`
  - `name: String`
  - `description: String`
  - `id: Integer`
  - `namespace: String`
  - `version: String`

#### CalmInterface
- Observed fields:
  - `interfaceJson: String`
  - `name: String`
  - `description: String`
  - `id: Integer`
  - `namespace: String`
  - `version: String`

#### Create request models for versioned artifacts
- Observed:
  - `CreatePatternRequest`
  - `CreateFlowRequest`
  - `CreateInterfaceRequest`
  - `CreateStandardRequest`
  - `ArchitectureRequest`
- Observed validation:
  - Pattern, flow, and interface create requests validate `name` and JSON as non-blank.
  - Standard and architecture request models do not consistently declare field-level bean validation.

#### ControlDetail
- Observed fields:
  - `id: Integer`
  - `name: String`
  - `description: String`

#### CreateControlRequirement
- Observed fields:
  - `name: String`
  - `description: String`
  - `requirementJson: String`
- Observed validation:
  - all three fields are `@NotBlank`

#### CreateControlConfiguration
- Observed fields:
  - `configurationJson: String`
- Observed validation:
  - `configurationJson` is `@NotBlank`

#### Decorator
- Observed fields:
  - `schema: String`
  - `uniqueId: String`
  - `type: String`
  - `target: List<String>`
  - `targetType: List<String>`
  - `appliesTo: List<String>`
  - `data: Object`
- Inferred: `uniqueId` is a logical decorator identity inside the JSON payload, distinct from the numeric decorator ID used by the repository API.

#### Adr
- Observed fields:
  - `title: String`
  - `status: Status`
  - `creationDateTime: LocalDateTime`
  - `updateDateTime: LocalDateTime`
  - `contextAndProblemStatement: String`
  - `decisionDrivers: List<String>`
  - `consideredOptions: List<Option>`
  - `decisionOutcome: Decision`
  - `links: List<Link>`

#### AdrMeta
- Observed fields:
  - `namespace: String`
  - `id: int`
  - `revision: int`
  - `adr: Adr`

#### NewAdrRequest
- Observed fields:
  - `title: String`
  - `contextAndProblemStatement: String`
  - `decisionDrivers: List<String>`
  - `consideredOptions: List<Option>`
  - `decisionOutcome: Decision`
  - `links: List<Link>`
- Observed behavior:
  - title, problem statement, and decision drivers are sanitized on assignment.

#### ResourceMapping
- Observed fields:
  - `namespace: String`
  - `customId: String`
  - `resourceType: ResourceType`
  - `numericId: int`

#### UserAccess
- Observed fields:
  - `username: String`
  - `permission: Permission`
  - `namespace: String`
  - `resourceType: UserAccess.ResourceType`
  - `userAccessId: int`
  - `creationDateTime: LocalDateTime`
  - `updateDateTime: LocalDateTime`
- Observed enums:
  - `Permission = read | write`
  - `ResourceType = patterns | flows | adrs | architectures | all`

#### SchemaVersionRequest
- Observed fields:
  - `version: String`
  - `schemas: Map<String, Object>`

### Summary DTOs
- Observed:
  - `NamespaceArchitectureSummary`
  - `NamespacePatternSummary`
  - `NamespaceFlowSummary`
  - `NamespaceInterfaceSummary`
  - `NamespaceStandardSummary`
  - `NamespaceAdrSummary`
- Observed shared shape:
  - `id`
  - `name` and `description` for most artifact summaries
  - `title` and `status` for ADR summaries

### Validation Rules
- Observed:
  - Namespace regex: `^[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*$`
  - Domain regex: `^[A-Za-z0-9-]+$`
  - Version regex: `^(0|[1-9][0-9]*)[-.]?(0|[1-9][0-9]*)[-.]?(0|[1-9][0-9]*)$`
  - Custom ID regex: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`
  - Decorator query params regex: `^[A-Za-z0-9_/.-]+$`
- Observed:
  - Decorator path `id` must be a positive integer.
  - Several request objects require non-null or non-blank payload fields through bean validation.
- Inferred: Because version regex accepts both dots and hyphens, the API tolerates both external and storage-oriented semver representations in path parameters.

## 7. Non-Functional Requirements (Inferred)

### Performance Expectations
- Observed: Most reads are simple list or point-lookup operations over namespace/domain collections.
- Observed: Mongo mode creates indexes for uniqueness and reverse lookup on resource mappings.
- Inferred: The service is optimized for repository-style read/write operations rather than analytical queries.
- Inferred: The front-controller latest-version lookup depends on fetching version lists and sorting semver values, which is acceptable for modest per-resource version counts.

### Security Considerations
- Observed: Secure mode requires HTTPS and authenticated access to `/calm/*`.
- Observed: Scope checks are enforced before namespace-level access checks.
- Observed: Raw user-provided strings in several error messages are sanitized with a strict OWASP policy.
- Observed: ADR request rich-text fields are sanitized before persistence.
- Inferred: Because many resources store raw JSON strings, downstream consumers must still treat returned content as untrusted input.

### Reliability and Error Handling
- Observed: Resource methods translate domain exceptions into predictable HTTP status codes.
- Observed: Duplicate prevention is implemented at the database level in Mongo mode and with locks in Nitrite mode.
- Observed: The front-controller attempts rollback of reserved mappings if downstream resource creation fails.
- Observed: If Mongo index creation fails at startup, the application logs a warning and continues.
- Inferred: In Mongo mode, duplicate protection remains correct across multiple instances; in standalone mode, protection is process-local.

### Scalability
- Inferred: Mongo mode is suitable for multi-instance deployment because uniqueness is enforced in the database.
- Inferred: Standalone Nitrite mode is better suited for local, single-node, or development use cases.

### Observability and Maintainability
- Observed: Resource classes log error conditions with context.
- Observed: OpenAPI and Swagger UI are enabled.
- Observed: Test coverage requirements are strict and enforced in Maven builds.

## 8. Ambiguities and Gaps
- Observed: Standard write endpoints are annotated with `architectures:read` as an allowed scope for `POST`, which appears inconsistent with the write requirements used elsewhere.
- Observed: Request-body validation is uneven:
  - pattern, flow, interface, namespace, domain, and control request models use stronger bean validation
  - architecture and standard creation models are less strictly validated
- Observed: The front-controller only supports five resource types and excludes decorators, controls, schemas, ADRs, and user-access records.
- Observed: `AccessControlFilter` contains a TODO that explicitly states RBAC enforcement is incomplete or pending.
- Observed: `UserAccessValidator` grants default access to authenticated users for `GET /calm/namespaces`.
- Observed: Authorization matching relies partly on `request path contains resourceType name`, which is less explicit than route-to-permission mapping.
- Observed: Some error responses are plain strings, some are JSON fragments, and some are empty bodies, so error payload contracts are not standardized.
- Observed: PUT mutability is supported only for architectures, patterns, and flows, but the broader product rule for mutability versus immutability is not formalized in a shared contract.
- Observed: Schema version requests trim the version before persistence, but comparable normalization is not uniformly documented or applied across all resource types.
- Inferred: The distinction between repository persistence model and CALM semantic validation is partial; many endpoints validate request shape and parseability but not full domain-specific schema correctness.

## 9. Improvement Opportunities
- Inferred: Tighten scope annotations so every mutating endpoint consistently requires a write-capable scope.
- Inferred: Normalize request validation across resource families, especially architectures and standards.
- Inferred: Standardize error response payloads into a common structure with machine-readable fields such as `code`, `message`, and `details`.
- Inferred: Replace substring-based authorization checks with explicit route-to-resource permission mapping.
- Inferred: Clarify and centralize the product rule for whether versions are immutable by default and which resource families may support mutation.
- Inferred: Consider extending front-controller support if friendly IDs are meant to be a cross-cutting access pattern rather than a subset feature.
- Inferred: Formalize JSON/schema validation boundaries so clients know whether a stored document is only syntactically valid JSON or also validated against CALM-specific schema rules.
