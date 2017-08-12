import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import {GRAPHQL_ENDPOINT} from './Config';

function fetchQuery(operation, variables) {
    return fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    }).then(response => {
        return response.json();
    });
}

const environment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

export {
    environment
};