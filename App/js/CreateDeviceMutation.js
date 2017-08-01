import {commitMutation, graphql} from 'react-relay';
import winston from 'winston';

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
            onCompleted: response => winston.info(response),
            onError: err => winston.error(err),
        }
    );
}
