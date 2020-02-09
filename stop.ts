/* tslint:disable:no-console */
import { promises as fs } from 'fs'
import * as util from 'util'
import 'dotenv/config'
// import { IgApiClient, LiveEntity } from 'instagram-private-api';
// import Bluebird = require('bluebird'); 

import { login, getClient } from './login'

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

// console.log('getClient', getClient().then(console.log));

(async () => {
    const broadcast_id = await fs.readFile('broadcast_id', 'binary')

    await login()

    const ig = await getClient()

    const result = await ig.live.endBroadcast(broadcast_id)

    console.log('endBroadcast', result)
})()