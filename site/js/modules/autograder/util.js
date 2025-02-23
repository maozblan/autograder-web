import sjcl from './vendor/sjcl.min.js'

function getTimestampNow() {
    return Date.now()
}

function sha256(text) {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(text));
}

export {
    getTimestampNow,
    sha256,
}
