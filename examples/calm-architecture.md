---
architecture: ../calm/architecture/calm-2.json
---
## Architecture Overview


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

        subgraph calm-hub-system["CALM Hub System"]
        direction TB
            calm-hub["CALM Hub API"]:::node
            calm-hub-ui["CALM Hub UI"]:::node
            mongodb["MongoDB"]:::node
        end
        class calm-hub-system boundary
        subgraph vscode["Visual Studio Code"]
        direction TB
            calm-vscode["VSCode Extension"]:::node
        end
        class vscode boundary

    calm-cli["CALM CLI"]:::node
    calm-user["CALM User"]:::node

    calm-user -->|CALM user interacts with CALM Hub UI through web browser| calm-hub-ui
    calm-user -->|CALM user interacts with CALM CLI through command line| calm-cli
    calm-user -->|CALM user interacts with VSCode extension through IDE| calm-vscode
    calm-cli -->|CLI interacts with CALM Hub API REST endpoint for publishing and retrieving architectures| calm-hub
    calm-hub -->|CALM Hub API stores and retrieves data from MongoDB| mongodb
    calm-hub-ui -->|CALM Hub UI interacts with CALM Hub API via REST endpoint| calm-hub



```


## Nodes

### CALM User
User working with CALM architectures through various tools and interfaces

### CALM CLI
Command-line interface for CALM operations including validation, generation, visualization, and documentation

### VSCode Extension
Visual Studio Code extension providing IDE integration for CALM architectures with syntax highlighting, validation, and visualization

### CALM Hub API
Central registry and API service for CALM architectures, patterns, and standards built with Quarkus

### CALM Hub UI
React-based web interface for browsing and managing CALM architectures, patterns, and standards

### MongoDB
Document database for storing CALM architectures, patterns, and standards in CALM Hub

### CALM Hub System
Complete CALM Hub system including API backend, web UI, and database

### Visual Studio Code
Microsoft Visual Studio Code IDE

