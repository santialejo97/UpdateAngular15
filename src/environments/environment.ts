// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  apiUrl: 'https://localhost:44310',
  servicioBackend: 'https://localhost:44310', 

  // apiUrl: 'http://192.168.38.11:8081',
  // servicioBackend: 'http://192.168.38.11:8081',
  
  recuperarContraseña: 'http://192.168.37.131/securityweb2/alcance_usuario/asignacionContrasenaUsuario2.aspx',
  siteKey: '6LfLnqgfAAAAAO0oVD8hkRPZQotMVDu8XIIj9fAi',
  secretKey: '6LfLnqgfAAAAABlOJOe1MtWwY0b6TaPR9iazkrI7',
  captchaBand: false,
  baseSiteSIIN: 'SiteSIIN',
  activeLogs: true,
  TiempoDeValidezLinkEnMinutos: 5
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
