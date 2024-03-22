export class IRelacionPacienteAfiliacionSaludModel {
  id_incapacidad!: string;
  id_paciente!: number;
  codigo_eps!: string;
  tipo_afiliado!: string;
  estado!: string;
  regimen!: string;
  departamento_afil!: string;
  municipio_afil!: string;
  afiliado_PVS!: number;
  fecha_inicio_contrato!: Date | null;
  fecha_fin_contrato!: Date | null;
  afiliado_INPEC!: number;
  fecha_ingreso_inpec!: Date | null;
  fecha_retiro_inpec!: Date | null;
}
