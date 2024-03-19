import { ILogin } from './ILogin';
import { IPerfil } from './IPerfil';
import { IUsuario } from './IUsuario';


export interface IAuthenticatedResponse

{
    AccessToken: string;
    RefreshToken: string;
}
