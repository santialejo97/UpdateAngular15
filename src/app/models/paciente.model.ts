import { IAportanteModel } from './Aportante.model';
import { IRelacionPacienteAfiliacionSaludModel } from './RelacionPacienteAfiliacionSalud.model';
import { IRelacionPacienteAportanteModel } from './RelacionPacienteaportante.model';

export interface IPacienteModel {
  id_paciente: number;
  tipo_documento: string;
  numero_documento: string;
  // paciente_encontrado: boolean;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;

  sexo: string;
  fecha_nacimiento: Date;
  fecha_nacimiento_string: string;
  cod_depto_residencia: string;
  cod_mun_residencia: string;

  regimen_descripcion: string;
  id_regimen: string;

  // WS I
  id_incapacidad_anulado: number;
  // WS F

  eps: string;
  /*razon_social:string;
  tipo_documento_empleador:string;
  numero_documento_empleador: string;
  ubicacion_empleador: string;*/

  depto_residencia_descripcion: string;
  ciudad_residencia_descripcion: string;

  origen_pac_descripcion: string;
  causaatencion_pac_descripcion: string;
  retroactiva_pac_descripcion: string;
  sexo_descripcion: string;

  eps_nombre: string;

  relacionPacienteAfiliacionSalud: IRelacionPacienteAfiliacionSaludModel;

  aportantes: IAportanteModel[];
  aportanteSeleccionado: IAportanteModel | null;

  relacionesPacienteAportante: IRelacionPacienteAportanteModel[];
  relacionPacienteAportanteSeleccionada: IRelacionPacienteAportanteModel | null;

  info_consulta: string;
}
