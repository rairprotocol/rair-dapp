---
title: Contributing to RAIRprotocol

---

# Contributing to RAIRprotocol

Welcome to RAIRprotocol! A fully open source and open infrastructure web3 deployment layer. Here you'll find all of the docker based tooling needed to quickly deploy scalable dApps. 

My contributing and making our system better you are eligible to receive RAIR token rewards!

## Getting Started

To get started, read the [How this repo works](#how-this-repo-works) section below to learn about the structure of this repo. From there, you can take a look at our [help wanted](https://github.com/thirdweb-dev/js/labels/good%20first%20issue) issues and find an issue that interests you!

If you have any questions about the issue, feel free to reachout on our [X/rairprotocol](https://x.com/rairprotocol) or comment directly on an issue. 


## How this repo works

[@rairprotocol/rair-dapp](https://github.com/rairprotocol/rair-dapp) is a monorepo, meaning it contains many projects within it. We intentionally packaged our full out-of-the-box dApp deployment layer into a single repo to add in deployment speed and ease of use. 


You can see a quick outline of each sub system within our project below:

| Package                        | Description                                                          | Location                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [/rair-node](./rair-dapp/rairnode)         | Backend for rair dApp deployment layer. REDIS, Mongo, API   | rair-dapp repo          </a>         |
| [/rair-front](./rair-dapp/rair-front)     | Typescript factored frontend using REACT Native. Optimized for desktop and mobile. Notifications, user profiles, marketplace, metadata UI/UX                | rair-dapp repo     |
| [/rair-sync](./packages/auth)       | Universal syncing engine compatible with any RPC natively. Optimized for Alchemy.                | rair-dapp repo       |
| [/rair-infra](./packages/storage) | K8 deployment tools. Manifests, config  maps, terraform scripts         | rair-dapp repo |
| [/rair-solidity](./packages/cli)         | ERC2535 diamond multi proxy pattern smart contracts. Royalties, minting, trade and execution | rair-solidity repo                           |

## How to contribute

Let's explore how you can set up the repo on your local machine and start contributing!

This section requires some existing knowledge of [Git](https://git-scm.com/), [Docker Compose](https://docs.docker.com/compose/) and [Github Actions](https://docs.github.com/en/actions).



### Getting the repo

For OSS contributions, we use a [Forking Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow), meaning each developer will fork the repo and work on their own fork; and then submit a PR to the main repo when they're ready to merge their changes.

To begin:

1. [Create a fork](https://github.com/rairprotocol/rair-dapp/fork) of this repository to your own GitHub account.

2. [Clone your fork](https://help.github.com/articles/cloning-a-repository/) to your local device or cloud VM.

3. Create a new branch on your fork to start working on your changes:

   ```
   git checkout -b MY_BRANCH_NAME
   ```

4. Install the dependencies to run manually or simply run docker. See [full deployment guide here](https://docs.rairprotocol.org/rairprotocol/installation-and-testing/getting-started/rairlite-single-vm)
   ```
   npm.. or docker start
   ```

Now you have got the repo on your local machine, and you're ready to start making your changes! Our dApp works best with 4vcpu 16gb ram 32 ssd virtual machines running Ubuntu linux. If your local setup does not support this we recommend you deploy and develop on a virtual machine. 

### Test Your Changes

To ensure your docker compiles [see our test plan here](https://docs.rairprotocol.org/rairprotocol/installation-and-testing/getting-started/rairlite-single-vm/mvp-test-plan). 

### Publish Your Changes

Once you're satisfied with your changes, you are ready to submit them for review!

1. Use [changeset](https://github.com/changesets/changesets) to generate a changeset file:

```
yarn changeset
```

We follow [semantic versioning](https://semver.org/) for generating versioned releases of our packages (i.e. version = `MAJOR.MINOR.PATCH`)

- Update `major` for breaking changes
- Update `minor` for new features,
- Update `patch` for non-breaking bug fixes, etc)

2. Commit the changeset along with your changes:

```
git commit -am "My commit message"
```

3. Push your changes to the SDK:

```
git push origin MY_BRANCH_NAME
```

4. Create a [pull request](https://www.atlassian.com/git/tutorials/making-a-pull-request) to the `main` branch of the official (not your fork) repo.

It's helpful to tag PRs with `[rair-node]`, `[rair-front]`, `[rair-sync]`, (the name of the sub repo you're modifying) to indicate the package that you are engaging with.

### Earn Rewards

Making our deployment layer betters earns rewards! [See details here](https://docs.rairprotocol.org/rairprotocol/tokenomics/litepaper-start-here) for how to apply. 

