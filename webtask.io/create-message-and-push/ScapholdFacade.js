import {createApolloFetch} from 'apollo-fetch';
import winston from 'winston';

export default class ScapholdFacade {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.apolloFetch = createApolloFetch({uri: 'https://us-west-2.api.scaphold.io/graphql/voluntizer'});
    }

    async getTokens() {
        winston.info('logging in to Scaphold');
        await this._login();

        winston.info('fetching tokens from Scaphold');
        const graphqlResult = await this.apolloFetch({
            query: `query { 
                viewer {
                    allDevices {
                        edges {
                            node {
                                expoToken
                            }
                        }
                    }
                }
            }`,
            variables: {}
        });

        winston.info('extracting tokens from Scaphold response');
        return graphqlResult['data']['viewer']['allDevices']['edges'].map((n) => n['node']['expoToken']);
    }

    async _login() {
        const loginUserResult = await this.apolloFetch({
            query: `mutation loginUser($input: LoginUserInput!) {
                loginUser(input: $input) {
                    token
                }
            }`,
            variables: {
                input: {
                    username: this.username,
                    password: this.password,
                },
            }
        });

        const loginUserToken = loginUserResult['data']['loginUser']['token'];

        this.apolloFetch.use(({request, options}, next) => {
            if (!options.headers) {
                options.headers = {};
            }
            options.headers['Authorization'] = 'Bearer ' + loginUserToken;
            next();
        });
    }
}
