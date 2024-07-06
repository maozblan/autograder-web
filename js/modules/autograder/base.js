import * as Core from './core.js'
import * as Users from './users.js'

// API functions to interact with an autograder server.

let hasCredentials = Core.hasCredentials;
let setCredentials = Core.setCredentials;
let clearCredentials = Core.clearCredentials;

export {
    Users,

    hasCredentials,
    setCredentials,
    clearCredentials,
}
