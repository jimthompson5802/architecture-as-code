---
architecture: calm-hub.architecture.json
---
## Architecture Overview

- **name:** CALM Hub Architecture
- **description:** Architecture of the CALM Hub system, comprising a React UI, a Quarkus REST API backend, a MongoDB database, and an optional Keycloak OIDC identity provider.

```mermaid
---
config:
  theme: base
  themeVariables:
    fontFamily: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', system-ui, 'Ubuntu', sans-serif
    darkMode: false
    fontSize: 14px
    edgeLabelBackground: '#d5d7e1'
    lineColor: '#000000'
---
%%{init: {"layout": "elk", "flowchart": {"htmlLabels": false}}}%%
flowchart TB
classDef boundary fill:#e1e4f0,stroke:#204485,stroke-dasharray: 5 4,stroke-width:1px,color:#000000;
classDef node fill:#eef1ff,stroke:#007dff,stroke-width:1px,color:#000000;
classDef iface fill:#f0f0f0,stroke:#b6b6b6,stroke-width:1px,font-size:10px,color:#000000;
classDef highlight fill:#fdf7ec,stroke:#f0c060,stroke-width:1px,color:#000000;

        subgraph calm-hub-system["CALM Hub"]
        direction TB
            calm-hub-api["CALM Hub API"]:::node
            calm-hub-ui["CALM Hub UI"]:::node
            keycloak["Keycloak"]:::node
            mongodb["MongoDB"]:::node
        end
        class calm-hub-system boundary
        subgraph traderx-application["TraderX Application"]
        direction TB
            traderx-git-repo["TraderX GIT Repo"]:::node
        end
        class traderx-application boundary

    architect["Architect"]:::node

    architect -->|The Architect interacts with the CALM Hub UI to browse and manage CALM artefacts.| calm-hub-ui
    calm-hub-ui -->|The CALM Hub UI calls the CALM Hub REST API over HTTP#40;S#41; to fetch and display namespaces, patterns, architectures, flows, standards, controls, and decorators.| calm-hub-api
    calm-hub-api -->|The CALM Hub API persists and retrieves all CALM artefacts #40;patterns, architectures, flows, etc.#41; from MongoDB.| mongodb
    calm-hub-ui -->|When OIDC authentication is enabled, the CALM Hub UI redirects users to Keycloak for sign-in using the authorisation-code flow.| keycloak
    calm-hub-system -->|Architecture governance interactions| traderx-application
    calm-hub-api -->|When the secure profile is active, the CALM Hub API validates inbound JWT bearer tokens against the Keycloak realm.| keycloak



```


## Nodes

### CALM Hub UI
React single-page application (Vite) that allows users to browse namespaces, patterns, architectures, flows, standards, controls, and decorators stored in the CALM Hub.

### CALM Hub API
Quarkus JAX-RS REST backend exposing the /calm/** namespace. Serves patterns, architectures, flows, standards, controls, schemas, domains, decorators, ADRs, and user-access resources.

### MongoDB
MongoDB instance used as the primary persistent storage backend for CALM Hub (database: calmSchemas).

### CALM Hub
The CALM Hub system, composed of the UI, API, MongoDB database, and Keycloak identity provider.

### TraderX Application
The TraderX application system, composed of its source code repository and related components.

### TraderX GIT Repo
Git repository hosting the TraderX source code.

### Architect
A human architect who uses the CALM Hub UI to browse, create, and manage CALM artefacts such as patterns, architectures, and flows.

### Keycloak
OIDC identity provider for CALM Hub. Used when the secure profile is enabled; the UI performs OIDC sign-in redirects and the API validates JWT tokens against this realm.

