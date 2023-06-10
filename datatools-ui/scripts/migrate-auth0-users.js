/**
 * A script that will read all users from one Auth0 tenant and create new users
 * in another Auth0 tenant. The existing users' metadata will be ready and only
 * those users with a matching datatools client_id will be copied over. The new
 * users will have new passwords set, so the users will have to reset their
 * passwords to regain access.
 *
 * Two config files are required for this to work. The `from-client.json` will
 * contain information for machine-to-machine connections and the existing
 * client application ID that users should have in their metadata. The
 * `to-client.json` file should have information for machine-to-machine
 * connections and the client application ID that will replace to old
 * applicaiton client ID in their metadata.
 *
 * If deleting (and then recreating) existing users in the to tenant is desired,
 * the connection ID is also required. A way to find the connection ID involves
 * going to the Auth0 API explorer, setting the API token with a token generated
 * from a machine-to-machine API for the to tenant and then executing the "Get
 * all connections" endpoint.
 * See here: https://auth0.com/docs/api/management/v2#!/Connections/get_connections.
 * That endpoint will give a listing of all connections. Find the connection
 * with the name "Username-Password-Authentication" and use that ID.
 *
 * Both of the `from-client.json` and `to-cleint.json` files should have the
 * following base format:
 *
 * {
 *   "apiClient": "SECRET",
 *   "apiSecret": "SECRET",
 *   "domain": "SECRET.auth0.com",
 *   "clientId": "SECRET"
 *   "connectionId": "secrect" // optional in to-client.json for deleting users
 * }
 *
 *
 * To run the script, open a cli and type `node migrate-auth0-users.js`
 */

const fetch = require('isomorphic-fetch')
const omit = require('lodash/omit')
const qs = require('qs')
const uuid = require('uuid/v4')

// load required config files
const from = require('./from-client.json')
const to = require('./to-client.json')

const DEFAULT_CONNECTION_NAME = 'Username-Password-Authentication'
const deleteExistingUsersInToClient = true

/**
 * Get a Management API token using machine-to-machine credentials.
 */
async function getManagementToken (connectionSettings) {
  const { apiClient, apiSecret, domain } = connectionSettings

  // make request to auth0 to get a token
  const token = await fetch(
    `https://${domain}/oauth/token`,
    {
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: apiClient,
        client_secret: apiSecret,
        audience: `https://${domain}/api/v2/`
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST'
    }
  )
    .then((res) => res.json())
    .then((json) => {
      if (!json.access_token) {
        // Encountered a problem authenticating with API, raise error
        console.error(json)
        throw new Error('error authenticating with Auth0 Management API')
      } else {
        // Authentication successful
        console.log(`received access to management api for domain ${domain}`)
        return json.access_token
      }
    })
  return token
}

/**
 * Create header information to perform authenticated requests to management API
 */
function makeHeaderWithToken (token) {
  return {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json'
  }
}

/**
 * Helper to wait for a bit
 * @param  waitTime time in milliseconds
 */
function promiseTimeout (waitTime) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, waitTime)
  })
}

/**
 * Delete a user from a tenant
 */
async function deleteUser (domain, token, connectionId, email) {
  // deleting a lot of users individually can sometimes result in 429 errors
  // from Auth0, so wait 4 seconds just in case.
  await promiseTimeout(4000)

  const response = await fetch(
    `https://${domain}/api/v2/connections/${connectionId}/users?${qs.stringify({email})}`,
    {
      headers: makeHeaderWithToken(token),
      method: 'DELETE'
    }
  )
  if (response.status >= 400) {
    console.error(`Failed to delete user! Received status: ${response.status}`)
    console.error(await response.text())
  }
}

/**
 * make request to create user
 */
async function createUser (domain, token, user) {
  const response = await fetch(
    `https://${domain}/api/v2/users`,
    {
      body: JSON.stringify(user),
      headers: makeHeaderWithToken(token),
      method: 'POST'
    }
  )

  // check if request succeeded
  const createFailed = response.status >= 400
  const responseJson = await response.json()
  if (createFailed) {
    // although the creation failed, don't raise an error as most
    // of the time this was caused by the user already existing
    console.error(`created user failed for ${user.email}`)
    return { responseJson, success: false }
  } else {
    // user creation successful!
    console.log(`created user ${user.email}`)
    return { success: true }
  }
}

async function main () {
  // get management tokens for both from and to tenants
  const fromToken = await getManagementToken(from)
  const toToken = await getManagementToken(to)

  // iterate through all users in from manager
  let numUsersFetched = 0
  let totalUsers = Number.POSITIVE_INFINITY
  let page = 0

  while (numUsersFetched < totalUsers) {
    // get a batch of 100 users (a limit imposed by auth0)
    const response = await fetch(
      `https://${from.domain}/api/v2/users?per_page=100&include_totals=true&page=${page}`,
      {
        headers: makeHeaderWithToken(fromToken)
      }
    )
    const json = await response.json()

    // update the progress of fetching users
    numUsersFetched += json.users.length
    console.log(`fetched ${numUsersFetched} users so far`)
    totalUsers = json.total
    page++

    // iterate through fetched users
    for (let user of json.users) {
      // only users that have a matching clientId should be created in the
      // new tenant, so assume they shouldn't be created until finding a
      // match
      let shouldCreateInNewApp = false

      // replace all user and app metadata with only the matching from
      // client data and then replace the client ID with the to client ID
      const metadatas = ['user_metadata', 'app_metadata']
      metadatas.forEach(metadataKey => {
        if (!user[metadataKey]) return
        const metadata = user[metadataKey]
        if (!metadata.datatools) return
        metadata.datatools = metadata.datatools.filter(
          dt => dt.client_id === from.clientId
        )
        if (metadata.datatools.length > 0) {
          shouldCreateInNewApp = true
          metadata.datatools[0].client_id = to.clientId
        }
      })

      // no match found, continue to the next user in the current batch
      if (!shouldCreateInNewApp) continue

      // can't copy over passwords, so set the password of the copied user
      // as a UUID so that it's extremely unlikely for some random person
      // to guess the password. The user will have to reset their password
      // to gain access.
      user.password = uuid()

      // add required connection name (this is the default value created
      // by Auth0, so it could theoretically be different.)
      user.connection = DEFAULT_CONNECTION_NAME

      // omit items that will cause the creation to fail or cause weirdness
      // in new data values
      user = omit(
        user,
        [
          'logins_count',
          'last_ip',
          'last_login',
          'last_password_reset',
          'created_at',
          'updated_at',
          'identities'
        ]
      )

      // Modify the user_id so an extra prefix isn't created. User IDs are in
      // the format `auth0|123456`. If that exact user ID is sent over as is
      // when creating the new user, the new user_id will look something like:
      // `auth0|auth0|123456`. If now user_id is included in the create user
      // request, then a completely new user_id is created. However, if a the
      // user_id is just the data beyond the "auth0|" (ie everything from
      // position 6 and beyond), then Auth0 will create a user_id with the
      // exact same data.
      user.user_id = user.user_id.substr(6)

      // attempt to create the user
      const createUserResult = await createUser(to.domain, toToken, user)
      if (!createUserResult.success) {
        // creation of user not successful, check if script should try again by
        // deleting an existing user
        if (
          createUserResult.responseJson.message === 'The user already exists.' &&
            deleteExistingUsersInToClient
        ) {
          // user creation failed due to existing user. Delete that existing
          // user and then try creating the user again
          console.log('Deleting existing user in to tenant')
          await deleteUser(to.domain, toToken, to.connectionId, user.email)
          const createUserResult2ndTry = await createUser(to.domain, toToken, user)
          if (!createUserResult2ndTry.success) {
            console.log('Creating user a 2nd time failed!')
            console.error(createUserResult.responseJson)
          }
        } else {
          console.error(createUserResult.responseJson)
        }
      }
    }
  }
}

main()
