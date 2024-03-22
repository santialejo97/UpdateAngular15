import { IAportanteModel } from './Aportante.model';
import { IIncapacidad } from './incapacidad.model';
import { IPacienteModel } from './paciente.model';

export class DatosRegistroIncapacidadDTO {
  incapacidad!: IIncapacidad;
  paciente!: IPacienteModel | null;
  aportante!: IAportanteModel;
}
