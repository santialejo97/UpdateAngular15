
export class IPerdidaCapacidadLaboral {
    
    
    id_concepto_registro: number;
    id_origen: number;
    numero_registro: string;
    porcentaje_perdida_capacidad_laboral: number;
    fecha_registro_calificacion: Date;
    fecha_calid_incapacidadificacion_PCL: Date;
    fecha_estructuracion: Date;
    nueva_calificacion: number;
    observaciones: string;
    tipo_profesional: number;
    
    
    despacho_autoridad_judicial: any;
    nombres_apellidos_juez: any;
    
    tipo_documento_entidad: any;
    numero_documento_entidad: any;
    nombre_razon_social: any;

    tipo_documento_emite: string;
    numero_documento_emite: string;    
    nombre_profesional_emite: any;

    diagnostico_principal: string;
    diagnostico_relacion_1: string;
    diagnostico_relacion_2: string;
}