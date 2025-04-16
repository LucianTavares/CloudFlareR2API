import Keycloak from 'keycloak-connect';
import session from 'express-session';

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
  'resource': 'intime-client',
  'auth-server-url': 'http://localhost:8080/',
  'realm': 'Intime',
  'confidential-port': 0,
  'ssl-required': 'external'
});

export { keycloak, memoryStore };