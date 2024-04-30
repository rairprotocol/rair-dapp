![Banner](/assets/img/banner.webp)
[![RAIRmarket](https://img.shields.io/badge/RAIR-market-C67FD1)](https://rair.market)
[![RAIRprotocol](https://img.shields.io/badge/RAIR-protocol-C67FD1)](https://rairprotocol.org)
![License](https://img.shields.io/badge/License-Apache2.0-yellow)
[![Discord](https://img.shields.io/badge/Discord-4950AF)](https://discord.gg/vuBUfB7w)
[![Twitter](https://img.shields.io/twitter/follow/rairprotocol)](https://twitter.com/rairprotocol)

# Getting Started
_Building RAIR is a snap! Follow these simple steps and you'll be up and running in no time._

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

    docker-compose -f {dockerfile.yml} up

`{dockerfile.yml}` will be the file configured for your specific deployment. Wait for the app to build. Keep an eye on the terminal for any errors. 

## Launch the App

Point the browser at the RAIRfrontend service (localhost:8088)

## Complete the MVP Test Plan

We've compiled a list of post-installation checks [here](https://docs.rairprotocol.org/rairprotocol/installation-and-testing/getting-started/rairlite-localhost/mvp-test-plan)

