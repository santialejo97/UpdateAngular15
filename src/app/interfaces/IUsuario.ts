	export interface IUsuario
	{
    usuarioValidado: boolean;
    nombreUsuario: string ;
    tipoDocumento: string ;
    numeroDocumento: string ;
    primerNombre: string ;
    segundoNombre: string ;
    primerApellido: string ;
    segundoApellido: string ;
    registroProfesional: string ;
    profesion: string ;
    email: string ;
    tipoUsuario: string ;
    programaUsuario: string ;
    bloqueado: boolean;
    deshabilitado: boolean;
    erroresLogin: number;
    fechaCreacion: Date;
    fechaUltActualizacion: Date;
    requiereCambioClave: boolean ;
    login: string;

    nombre_usuario: string;
    access_token: string;
    refresh_token: string;
    date_expiration: Date;
  
}
