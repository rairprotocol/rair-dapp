![Banner](/rair-infra/assets/img/banner.webp)
[![RAIRmarket](https://img.shields.io/badge/RAIR-market-C67FD1)](https://rair.market)
[![RAIRprotocol](https://img.shields.io/badge/RAIR-protocol-C67FD1)](https://rairprotocol.org)
![License](https://img.shields.io/badge/License-Apache2.0-yellow)
[![Discord](https://img.shields.io/badge/Discord-4950AF)](https://discord.gg/vuBUfB7w)
[![Twitter](https://img.shields.io/twitter/follow/rairprotocol)](https://twitter.com/rairprotocol)

# Getting Started
_Building RAIR is a snap! Follow these simple steps and you'll be up and running in no time._

![click walkthrough no narration](https://github.com/rairprotocol/RAIRsite/blob/main/src/assets/images/rair-install.webm)

## Clone the RAIR repository

First, get the source code
    
- Clone the RAIR repo to your local environment.

## Configure Environment Variables

Inside the repository root is a file called `.env.sample.` This template contains a list of values that are to be consumed during the build process:

- Create a new file in the repositry root called `.env`

- Copy and paste the contents of `.env.sample` into `.env`

## Install Docker-compose

RAIR deploys each its services in a self-contained Docker image:

- Docker-compose is required. It comes pre-packaged with [Docker-Desktop](https://www.docker.com/products/docker-desktop/), otherwise it must be installed [manually](https://docs.docker.com/compose/install/linux/#install-the-plugin-manually). 

## Deploy RAIR

It's the moment of truth. From the repository root, run:

    docker-compose -f docker-compose.local-new.yml up -d

Wait for the app to build. Keep an eye on the terminal for any errors. 

## Launch the App

Point the browser at the RAIRfrontend service (localhost:8088)

## Complete the MVP Test Plan

We've compiled a list of post-installation checks [here](https://docs.rairprotocol.org/rairprotocol/installation-and-testing/getting-started/rairlite-localhost/mvp-test-plan)

# Comprehensive dApp Architecture & Services

## System Architecture

### Microservices
*Core services that compose the application*

| Service | Purpose | Key Integrations |
|---------|---------|------------------|
| **rairnode** | Main backend service with API endpoints | MongoDB, Redis, JWT, IPFS |
| **blockchain-networks** | Blockchain data synchronization | Agenda, Ethers.js, MongoDB |
| **media-service** | Media file processing and delivery | GCP Storage, Pinata, IPFS |
| **rair-redis** | In-memory data store | Session management, Caching |
| **minting-network** | Frontend dApp for NFT minting | React, Redux, Web3 wallets |

## Core Technologies

### 1. Blockchain Infrastructure
*Essential blockchain connectivity and interaction*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| Ethers.js | Library | Ethereum blockchain operations | Contract calls, transactions, wallet integration |
| Alchemy SDK | SDK | Blockchain data access across networks | Network access, enhanced RPC capabilities |
| Wagmi | Hooks | React hooks for Ethereum | Simplified blockchain state handling in UI |
| Viem | Library | TypeScript interface for Ethereum | Alternative blockchain interactions |
| Web3Auth | Auth | Wallet authentication | Simplified wallet onboarding |
| Account Abstraction | SDK | Advanced wallet features | Gasless transactions, account management |

### 2. Storage Solutions
*Data storage across centralized and decentralized systems*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| MongoDB | Database | Primary persistent data store | User data, NFT metadata, application state |
| Redis | Cache | In-memory data store | Session management, caching, performance |
| IPFS | Decentralized | Content-addressed storage | NFT media, decentralized file storage |
| Pinata | Service | IPFS pinning service | Ensures IPFS content availability |
| GCP Storage | Cloud | Google Cloud Storage | Media files, backups, centralized storage |
| AWS S3 | Cloud | Amazon S3 object storage | Alternative file storage, backups |
| Filebase | Service | S3-compatible decentralized storage | Additional decentralized storage option |

### 3. Backend Services
*Server-side components and utilities*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| Express | Framework | Web server and API framework | API endpoints, routing, middleware |
| Mongoose | ODM | MongoDB object modeling | Database schema, validation, operations |
| Socket.IO | Realtime | WebSocket communication | Live updates, notifications, events |
| Agenda | Scheduler | Job scheduling for Node.js | Background tasks, blockchain syncing |
| Winston | Logging | Structured logging utility | Application logging, monitoring |
| Morgan | Middleware | HTTP request logger | API request tracking, debugging |
| Multer | Middleware | File upload handling | Processing user uploaded files |
| Body Parser | Middleware | Request body parsing | Handling JSON and form data |
| Swagger | Documentation | API documentation | Interactive API documentation |

### 4. Frontend Framework
*User interface foundation*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| React | Framework | UI component library | Core frontend framework |
| Redux Toolkit | State | Global state management | Application state, data flow |
| React Router | Navigation | Client-side routing | Page transitions, navigation |
| Vite | Build | Dev server and bundler | Fast development, optimized builds |
| TypeScript | Language | Typed JavaScript | Type safety, better developer experience |
| Styled Components | CSS | Component-level styling | Modular, maintainable UI styling |
| MUI Material | Components | React UI component library | Pre-designed UI elements |
| Bootstrap | CSS | Responsive design framework | Layout, responsive design |

### 5. Media & Content Components
*Rich media handling and display*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| Video.js | Player | Video playback library | NFT video content playback |
| React Player | Component | Media player component | Flexible media embed options |
| React Dropzone | Upload | File upload UI | Drag-and-drop file uploads |
| React Webcam | Media | Camera access component | Live video capture |
| React Multi Carousel | UI | Content carousel | Showcase multiple items |
| React Modal | UI | Dialog windows | User interactions, confirmations |

### 6. Security & Authentication
*Application protection and access control*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| JWT | Auth | JSON Web Token authentication | Secure API access |
| Express Session | Session | User session management | Persistent user sessions |
| Lusca | Security | Web vulnerability protection | CSRF, XSS protection |
| Yoti | Identity | Identity verification | Enhanced identity verification |
| Rate Limit | Middleware | Request throttling | API abuse prevention |
| CORS | Middleware | Cross-origin resource sharing | Frontend/backend communication |

### 7. Wallet Integration
*Blockchain wallet connectivity*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| MetaMask | Wallet | Browser extension wallet | Primary user wallet connection |
| WalletConnect | Protocol | Multi-wallet connector | Broader wallet compatibility |
| Web3Auth | Auth | Social login for wallets | Simplified wallet authentication |
| Alchemy AA | SDK | Account abstraction | Smart contract wallets |

### 8. Development & DevOps
*Development workflow and quality tools*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| ESLint | Linter | Code quality enforcement | Code standards, error prevention |
| Prettier | Formatter | Code formatting | Consistent code style |
| Husky | Git Hooks | Pre-commit tasks | Code quality automation |
| Nodemon | Dev | Server auto-restart | Development workflow efficiency |
| Docker | Container | Application containerization | Deployment, environment consistency |
| Vault | Security | Secret management | Secure credential management |

### 9. Monitoring & Analytics
*Application health and user insights*

| Name | Type | Description | Usage |
|------|------|-------------|-------|
| Sentry | Monitoring | Error tracking | Application reliability |
| Google Analytics | Analytics | Usage metrics | User behavior tracking |
| Custom Events | Tracking | Event monitoring | Flexible interaction tracking |

## Blockchain Networks
*Supported blockchain networks in the system*

| Network | Type | RPC Variables | Related Contracts |
|---------|------|--------------|------------------|
| Ethereum Mainnet | Production | ETHEREUM_MAINNET_RPC | Diamond Marketplace, Factory |
| Ethereum Sepolia | Testnet | ETHEREUM_TESTNET_SEPOLIA_RPC | Diamond Marketplace, Factory |
| Polygon/Matic Mainnet | Production | MATIC_MAINNET_RPC | Diamond Marketplace, Factory |
| Polygon/Matic Mumbai | Testnet | MATIC_TESTNET_RPC | Diamond Marketplace, Factory |
| Binance Smart Chain | Production | BINANCE_MAINNET_RPC | Diamond Marketplace, Factory |
| Binance Testnet | Testnet | BINANCE_TESTNET_RPC | Diamond Marketplace, Factory |
| Base | Production | BASE_MAINNET_RPC | Diamond Marketplace, Factory |
| Astar | Production | ASTAR_MAINNET_RPC | Diamond Marketplace, Factory |

## External Integrations
*Third-party services integrated in the application*

| Service | Category | Purpose | Variables |
|---------|----------|---------|-----------|
| Alchemy | Blockchain | Enhanced RPC, AA | ALCHEMY_API_KEY |
| Pinata | Storage | IPFS pinning | PINATA_KEY, PINATA_SECRET |
| GCP | Cloud | Cloud storage | GCP_CREDENTIALS, GCP_PROJECT_ID |
| Sentry | Monitoring | Error tracking | SENTRY_DSN |
| Zoom | Communication | Video meetings | ZOOM_API_KEY, ZOOM_API_SECRET |
| Yoti | Identity | ID verification | YOTI_CLIENT_ID |
| Google Analytics | Analytics | Usage tracking | GOOGLE_ANALYTICS |

