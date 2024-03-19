export interface IIncapacidad {
  
  id_incapacidad: string;
  tipo_documento_pac: string;
  numero_documento_pac: string;

  paciente_encontrado: boolean;
  primer_nombre_pac: string;
  segundo_nombre_pac?: string;
  primer_apellido_pac: string;
  segundo_apellido_pac: string
  sexo_pac: string;
  edad_pac: number;

  codigo: string;
  nombre: string;
  
  diagnostico_principal: string;
  diagnostico_relacion_1: string;
  diagnostico_relacion_2: string; 

  //id_diagnostico_principal: number;
  // codigo_diagnostico_principal: string;
  // descripcion_diagnostico_principal: string;
 
  // WS I
  id_incapacidad_anulado: number;
  proviene_anulado: boolean;

  // WS F

  id_servicio: number;
  id_finalidad: number;
  id_modalidad: number;
  retroactiva: boolean;
  id_retroactiva: number;
  id_trastorno_memoria: number;
  id_origen: number;
  id_causa : number;

  fecha_inicio_string: string ;
  fecha_fin_string: string ;

  fecha_inicio: Date ;
  fecha_fin: Date;
  dias_incapacidad: string;

  lugar_expedicion: string;
  lugar_expedicion_descripcion: string;
  fecha_expedicion: Date ;
  fecha_expedicion_string: string;
  
  prorroga: boolean ;
  dias_acumulados_prorroga: number;
  acumula_dias_pago : boolean;
  fecha_nacimiento_pac: string;
  id_incapacidad_anterior: string;


  codigo_diagnostico_principal: string;
  codigo_diagnostico_relacion_1: string;
  codigo_diagnostico_relacion_2: string;

  descripcion_diagnostico_principal: string;
  descripcion_diagnostico_relacion_1: string;
  descripcion_diagnostico_relacion_2: string;


  diagnostico: IDiagnosticoModel,
  diagnosticoRelacionUno: IDiagnosticoModel,
  diagnosticoRelacionDos: IDiagnosticoModel


  id_usuario_hercules: number, 
  id_entidad: number,
  id_rol: number,
  laboralNoVigente: boolean,

  id_estado_pago_validar: number,

  consulta: string,
  id_plan_contingencia:number,

  prorrogaNoEncontradaHistoricos: boolean,
  codigo_habilitacion: string

}

export class IDiagnosticoModel {
  id_diagnosticos: number;
  descripcion: string;
  habilitado: String;
}

export class Incapacidad {
  id_grupo_servicios: number;
}


