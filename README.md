 Node Todo API
==================

> A Todo list API using NodeJS based on [this Udemy NodeJS course](https://www.udemy.com/the-complete-nodejs-developer-course-2/)

## Table of contents

- [Getting started](#getting-started)
    - [System requirements](#system-requirements)
    - [Installation](#installation)
    - [Running tests](#running-tests)
    - [Additional resources](#additional-resources)
- [The Project](#the-project)
    - [Proposal](#proposal)
    - [Target](#target)
    - [Goals](#goals)
    - [Requirements](#requirements)
    - [Design considerations](#design-considerations)
- [Contributions](#contributions)
    - [Style guides](#style-guide)

## Getting started

### System requirements

- [Node 8.1.4 +](https://nodejs.org/en/)
- [Mongo DB 3.4.5 +](https://www.mongodb.com/download-center#community)
- Unix like operating system (OS X, Ubuntu, Debian, etc.)
- Not yet tested on Windows

### Installation

1. Clone or download the repository
1. `cp server/config/config.json.example server/config/config.json` and create your own keys for the following: `JWT_SECRET`
1. Make sure Mongo DB is installed. [Installation tutorial](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x)
1. In a separate terminal window, make sure Mongo DB process is running using `~/mongo/bin/mongod --dbpath ~/mongo-data`
1. To view in browser at *http://localhost:3000*, in a separate terminal window, enter `npm run dev`
1.

### Running tests

```shell
npm run test-watch
```

### Additional resources

## The Project

### Proposal

### Target Audiences

TBD

### Goals

- To gain knowledge of NodeJS and ExpressJS
- To develop a solid RESTful API backed by tests

### Requirements

### Design considerations

## Contributions

### Style guides

- [Airbnb JavaScript style guide](https://github.com/airbnb/javascript)
