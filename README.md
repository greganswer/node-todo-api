Node Todo API
==================

> A Todo list API using NodeJS based on the tutorial for [The Complete Node.js Developer Course](https://www.udemy.com/the-complete-nodejs-developer-course-2) on Udemy.

## Table of contents

- [Getting started](#getting-started)
    - [System requirements](#system-requirements)
    - [Installation](#installation)
    - [Running tests](#running-tests)
    - [Additional resources](#additional-resources)
- [The Project](#the-project)
    - [Proposal](#proposal)
    - [Target audiences](#target-audiences)
    - [Goals](#goals)
    - [Requirements](#requirements)
    - [Design considerations](#design-considerations)
    - [Todo](#todo)
- [Contributions](#contributions)
    - [Style guides](#style-guides)

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
1. In a separate terminal window, make sure Mongo DB process is running using `~/mongo/bin/mongod --dbpath ~/mongo-data` *(or wherever you have it installed)*
1. To view in browser at *http://localhost:3000*, in a separate terminal window, enter `npm run dev`

### Running tests

```shell
npm run test-watch
```

### Additional resources

- https://nodejs.org/en/docs/
- https://expressjs.com/

## The Project

### Proposal

I propose to complete this assignment as part of my quest to learn more about Node.js.

### Target audiences

- Hiring managers who want to see what I can do
- Developers who want to see some Node.js sample code

### Goals

- To gain knowledge of NodeJS and ExpressJS
- To develop a solid RESTful API backed by tests

### Requirements

- A computer with an internet connection
- I willingness to be challenged in order to learn and grow

### Design considerations

- I followed the styles and best practices laid out in the course
- As I learn more about Node.js and JavaScript in general, I return to this project for refactoring

### Todo

- Refactor code based on [Airbnb JavaScript style guide](https://github.com/airbnb/javascript)
- Refactor code based on [Clean Code: A Handbook of Agile Software Craftsmanship](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

## Contributions

I'm not accepting contributions at this time but you can email me if you have any suggestions. greganswer@gmail.com

### Style guides

- [Airbnb JavaScript style guide](https://github.com/airbnb/javascript)
