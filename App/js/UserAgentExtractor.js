import React from 'react';
import {WebView} from 'react-native';

const HTML = `
<script>
setTimeout(function() {
  window.postMessage(navigator.userAgent);
}, 1000);
</script>
`;

function UserAgentExtractor({onUserAgent}) {
    return <WebView
        source={{html: HTML}}
        javaScriptEnabled={true}
        style={{width: 0, height: 0}}
        onMessage={(event) => onUserAgent(event.nativeEvent.data)}/>;
}

export default UserAgentExtractor;
