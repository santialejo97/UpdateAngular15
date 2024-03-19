import { ILogin } from './ILogin';
import { IPerfil } from './IPerfil';
import { IUsuario } from './IUsuario';


export interface IRetornoUsuario

{
    //usuarioValido: boolean;
    loginUsuario: ILogin;
    datosUsuario: IUsuario;
    datosRol: IPerfil[];
    codigo : string,
    mensaje: string
}
