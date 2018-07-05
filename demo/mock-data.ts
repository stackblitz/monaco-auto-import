import { File } from '../src'
import tokenise from '../src/parser/regex'

export const source = `
Test

startServer

app

find

findBy

defaultExport

HttpClient

ɵHttpInterceptingHandler
`
;(window as any).tokenise = tokenise

export const files: File[] = [
  {
    path: './src/test.ts',
    aliases: ['app/test'],
    imports: tokenise(`
      export class Test {}

      export default defaultExport
    `)
  },
  {
    path: './src/app.ts',
    aliases: ['app'],
    imports: tokenise(`
      export function startServer {}
      export const app: Express = express()
    `)
  },
  {
    path: './node_modules/lodash/index.js',
    aliases: ['lodash/index.js', 'node_modules/lodash/index.js'],
    imports: tokenise(`
      export function find(...args) {
        console.log('test', args)
      }
      export function findBy(...args) {
        console.log('test2', args)
      }
    `)
  },
  {
    path: './node_modules/@angular/common/http',
    aliases: ['@angular/common/http'],
    imports: tokenise(`
      export { HttpBackend, HttpHandler } from './src/backend';
      export { HttpClient } from './src/client';
      export { HttpHeaders } from './src/headers';
      export { HTTP_INTERCEPTORS, HttpInterceptor } from './src/interceptor';
      export { JsonpClientBackend, JsonpInterceptor } from './src/jsonp';
      export { HttpClientJsonpModule, HttpClientModule, HttpClientXsrfModule,
        HttpInterceptingHandler as ɵHttpInterceptingHandler
      } from './src/module';
      export { HttpParameterCodec, HttpParams, HttpUrlEncodingCodec } from './src/params';
      export { HttpRequest } from './src/request';
      export { HttpDownloadProgressEvent, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpResponseBase, HttpSentEvent, HttpUserEvent } from './src/response';
      export { HttpXhrBackend, XhrFactory } from './src/xhr';
      export { HttpXsrfTokenExtractor } from './src/xsrf';
  `)
  }
]
