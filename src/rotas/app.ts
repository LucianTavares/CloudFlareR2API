import express, { Response, Request } from 'express';
import { criarPasta, downloadArquivo, listaDeBuckets, listarArquivos, uploadArquivo } from '../servicos/cloudFlareR2.js';
import { rateLimiterMiddleware } from '../middleware/index.js';
import { keycloak } from '../config/keycloack.js';

export default class App {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.routes();
  }

  routes() {

    // this.app.use(
    //   session({
    //     secret: secret,
    //     resave: false,
    //     saveUninitialized: true,
    //     store: memoryStore,
    //   })
    // );

    // Middleware do Keycloak
    this.app.use(keycloak.middleware());

    this.app.use(rateLimiterMiddleware);

    // ESTA OPÇÃO ABAIXO É PARA CASO O 'KEYCLOAK-CONNECT' NÃO FUNCIONE OU SEJA RETIRADO.

    // keycloak JWT which can be obtained from keycloak like this:
    // curl -X POST 'http://localhost:8080/realms/<REALM>/protocol/openid-connect/token' -H 'Content-Type: application/x-www-form-urlencoded' -d 'client_id=<CLIENT_ID>' -d 'username=<USER>' -d 'password=<PASS>' -d 'grant_type=password' -d 'scope=email profile'
    // this.app.use((req: Request, res: Response, next: NextFunction) => {
    //   if (req.headers.authorization) {
    //     const token: string = req.headers.authorization?.split(' ')[1];

    //     if (!req.app.locals.publicKey || req.app.locals.publicKeyExpire < Date.now()) {
    //       axios.post(
    //         'http://localhost:8080/realms/Intime/protocol/openid-connect/token',
    //         qs.stringify({
    //           client_id: 'intime-client',
    //           username: 'username',
    //           password: 'senha',
    //           grant_type: 'password',
    //           scope: 'email profile',
    //         }),
    //         {
    //           headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //           },
    //         }
    //       )
    //       axios.get('http://localhost:8080/realms/Intime/protocol/openid-connect/certs')
    //         .then((response: AxiosResponse) => {
    //           const keys = response.data.keys;
    //           if (keys && keys.length > 0) {
    //             // Converte a chave pública do formato Base64 para PEM
    //             const base64Key = keys[0].x5c[0];
    //             const pubKey = `-----BEGIN CERTIFICATE-----\n${base64Key.match(/.{1,64}/g)?.join('\n')}\n-----END CERTIFICATE-----`;

    //             req.app.locals.publicKey = pubKey;
    //             req.app.locals.publicKeyExpire = Date.now() + 5 * 60 * 1000; // 5 min

    //             // Verifica o token JWT
    //             jwt.verify(token, req.app.locals.publicKey, { algorithms: ['RS256'] });
    //             next();
    //           } else {
    //             throw new Error('No keys found in Keycloak response');
    //           }
    //         })
    //         .catch((error) => {
    //           console.error('Failed to fetch public key', error);
    //           res.status(500).json({ error, logout: true });
    //         });
    //     } else {
    //       try {
    //         jwt.verify(token, req.app.locals.publicKey, { algorithms: ['RS256'] });
    //         next();
    //       } catch (error) {
    //         res.status(401).json(error);
    //       }
    //     }
    //   } else {
    //     res.status(401).json({
    //       error: 'Unauthorized',
    //       logout: true,
    //     });
    //   }
    // });

    this.app.get('/buckets', keycloak.protect(), async (req: Request, res: Response) => {
      const response = await listaDeBuckets();
      res.json(response);
    });

    this.app.put('/upload/:nomePasta', keycloak.protect(), (req: Request, res: Response) => {
      const { nomePasta } = req.params;
      const upload = uploadArquivo(nomePasta);

      upload(req, res, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'File uploaded successfully!', file: req.file });
      });
    });

    this.app.get('/download-arquivo', keycloak.protect(), async (req: Request, res: Response) => {
      const { nomePasta, nomeArquivo } = req.query;
      if (typeof nomePasta === 'string' && typeof nomeArquivo === 'string') {
        try {
          const stream = await downloadArquivo(nomePasta, nomeArquivo);
          stream.pipe(res);
        } catch (error) {
          res.status(500).send('Error downloading file');
        }
      } else {
        res.status(400).send('Invalid query parameters');
      }
    });

    this.app.get('/listar/:nomePasta', keycloak.protect(), async (req: Request, res: Response) => {
      const nomePasta = req.params.nomePasta;
      const arquivos = await listarArquivos(nomePasta);
      res.json(arquivos);
    });

    this.app.put('/criar-pasta/:nomePasta', keycloak.protect(), async (req: Request, res: Response) => {
      const { nomePasta } = req.params;
      const novaPasta = criarPasta(nomePasta);
      res.json(novaPasta);
    });

    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });
  }
}