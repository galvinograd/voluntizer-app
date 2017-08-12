# Voluntizer &middot; [![Build Status](https://travis-ci.org/galvinograd/voluntizer-app.svg?branch=master)](https://travis-ci.org/galvinograd/voluntizer-app)

Voluntizer is an app that connects volunteers with their NGOs. Our main difference is that we contact only the most relevant volunteers, based on their fields of interest, skills and location. This way, we only contact a small group of relevant volunteers personally and get a much higher response rate.

## Running the project

To setup the project on your machine, please follow these steps:

- After you clone the repository, you must run `yarn run build` to compile the Graphql code to Relay's runtime code. You will have to do so every time you change Graphql code.
- Ensure you can run the project on both Android and iOS by following [create-react-native-app](https://github.com/react-community/create-react-native-app) instructions.
- Install [yarn](https://github.com/yarnpkg/yarn) package manager.
- (Optional) Install [Expo XDE](https://github.com/expo/xde) and [exp cli](https://github.com/expo/exp), it's very convenient!
- (Optional) Install [wt-cli](https://github.com/auth0/wt-cli) if you plan to change webtask.io related code.

## Contributing

### Open Development

All work on Voluntizer happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

**If you have any questions**, feel free to contact us at our slack at our [slack room](https://voluntizer.slack.com).

### Report an Issue

Tag the issue with the corresponding labels:
- **enhancement** - new feature, optimization or improvement
- **bug** - unwanted or unexpected software behaviour
- **effect users** - effect user experience
- **infrastructure** - effect development and deployment environment
- **placeholder** - for feature requests only, it marks a request without full specifications
- **duplicate** - reserved for project admins
- **wontfix** - reserved for project admins

If the issue is a bug, please fill out the [issue template](ISSUE_TEMPLATE.md). This step is very important! Not doing so may result in your issue getting closed.

### Sending a Pull Request

We will do our best to keep the master branch in good shape, with a green build status at all times. The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation. We'll do our best to provide updates and feedback throughout the process.

**Before submitting a pull request**, please make sure the following is done:
- If you've changed any UX, you attached iOS and Android screenshots of the change to the pull request.
- If you added or removed essential steps in the development or deployment process, the changes reflected in .travis and README.md files.
- Your code lints and follows our [Style Guide](#style-guide).
- Your branch follows our [Branching Model](#branching-model).
- The pull request name is "the github issue title (fix #123)"

### Branching Model

We're using some variant of [Short-Lived Feature Branches](https://trunkbaseddevelopment.com/short-lived-feature-branches/).
- master branch - deployed automatically, every commit must pass the build
- feature/@username/* branch - will contain a feature, which is preferably correspond to an issue
- fix/@username/* branch - the same as feature/* branch, but for bugs

### Style Guide

Our linter will catch most styling issues that may exist in your code.
You can check the status of your code styling by simply running `yarn run lint`.

However, there are still some styles that the linter cannot pick up. If you are unsure about something, looking at [Airbnb's Style Guide](https://github.com/airbnb/javascript) will guide you in the right direction.
