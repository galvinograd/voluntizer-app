import {commitMutation, graphql} from 'react-relay';

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
    console.log(expoToken);
    return commitMutation(
        environment, {
            mutation: mutation,
            variables: {
                input: {
                    expoToken: expoToken,
                }
            },
            onCompleted: (response) => {
                console.log('Success!')
            },
            onError: err => console.error(err),
        }
    );
}
