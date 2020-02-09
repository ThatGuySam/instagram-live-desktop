/* tslint:disable:no-console */
import 'dotenv/config'
import { IgApiClient, IgLoginTwoFactorRequiredError } from 'instagram-private-api';
import * as Bluebird from 'bluebird';
import inquirer = require('inquirer');

let client = null

export const getClient = () => {
    if (client) return client

    client = new IgApiClient();
    client.state.generateDevice(process.env.IG_USERNAME);

    return client
}

// Return logged in user object
export const login =  async () => {
  // Initiate Instagram API client
  const ig = await getClient()
//   const ig = new IgApiClient();
//   ig.state.generateDevice(process.env.IG_USERNAME);
//   ig.state.proxyUrl = 'process.env.IG_PROXY';

    // console.log('process.env.IG_USERNAME', typeof process.env.IG_USERNAME)

  await ig.qe.syncLoginExperiments()

  // Perform usual login
  // If 2FA is enabled, IgLoginTwoFactorRequiredError will be thrown
  return Bluebird.try(() => ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD))
    .then(() => console.log('😀 Successfully Logged in'))
    .catch(
        IgLoginTwoFactorRequiredError,
        async err => {
            const {username, totp_two_factor_on, two_factor_identifier} = err.response.body.two_factor_info;
            // decide which method to use
            const verificationMethod = totp_two_factor_on ? '0' : '1'; // default to 1 for SMS
            // At this point a code should have been sent
            // Get the code
            const { code } = await inquirer.prompt([
                {
                type: 'input',
                name: 'code',
                message: `Enter code received via ${verificationMethod === '1' ? 'SMS' : 'TOTP'}`,
                },
            ]);
            // Use the code to finish the login process
            return ig.account.twoFactorLogin({
                username,
                verificationCode: code,
                twoFactorIdentifier: two_factor_identifier,
                verificationMethod, // '1' = SMS (default), '0' = TOTP (google auth for example)
                trustThisDevice: '1', // Can be omitted as '1' is used by default
            });
        },
    )
    .catch(e => console.error('An error occurred while processing two factor auth', e, e.stack))
}