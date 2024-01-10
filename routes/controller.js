const controller = {};

const decryptJSON = require('decrypt-json');

const { ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, OLD_ENCRYPTION_KEY } = require('./config');

const management = require('./management');

const someth = `
    m
    o
    v
    i
    n
    g

    t
    h
    e

    s
    n
    i
    p
    p
    e
    t

    d
    o
    w
    n
    .
`


controller.registerMethod(
    'fetch',
    Acl.ensure(function* (encryptedToken) {
      let allowed = false;
      try {
        const decrypted = decryptJSON(encryptedToken, ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, OLD_ENCRYPTION_KEY);
        const userInfo = yield management.users.findOne({ _id: decrypted._user });
        if (userInfo && (userInfo.status === 'enabled' || userInfo.status === 'registered')) {
            const companyInfo = {};
          const teamInfo = yield management.teams.findOne({ _id: userInfo.properties._tid });
          if (companyInfo) {
            // Company user
            allowed = companyInfo.status === 'enabled' && (!teamInfo || teamInfo.status === 'enabled');
          } else {
            // Standalone user
            allowed = !teamInfo || teamInfo.status === 'enabled';
          }
        }
      } catch (e) {
        console.error(e);
      }
}))
