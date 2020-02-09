/* tslint:disable:no-console */
import 'dotenv/config'
// import { IgApiClient, LiveEntity } from 'instagram-private-api';
// import Bluebird = require('bluebird'); 

import { login, getClient } from './login'

// console.log('getClient', getClient().then(console.log));

(async () => {
    await login()

    const ig = await getClient()

    const result = await ig.live.endBroadcast('18087023044149402')

    console.log('endBroadcast', result)
})()