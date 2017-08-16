import {commitMutation, graphql} from 'react-relay';
import {logCodeEvent, wakeMeUp} from './Logger';

const mutation = graphql`
    mutation CreateDeviceMutation($input: CreateDeviceInput!) {
        createDevice(input: $input) {
            changedDevice {
                id
            }
        }
    }
`;

export default function commit(environment, expoToken) {
    return commitMutation(
        environment, {
            mutation: mutation,
            variables: {
                input: {
                    expoToken: expoToken,
                }
            },
            onCompleted: response => logCodeEvent('push notifications', 'register - backend', response),
            onError: err => wakeMeUp('push notifications', 'register - backend', err),
        }
    );
}
