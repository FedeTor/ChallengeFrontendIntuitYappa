export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  razonSocial: string;
  cuit: string;
  fechaNacimiento: string;
  telefonoCelular: string;
  email: string;
  fechaCreacion: string;
  fechaModificacion: string;
}

export interface ClienteCreateDto {
  nombre: string;
  apellido: string;
  razonSocial: string;
  cuit: string;
  fechaNacimiento: string;
  telefonoCelular: string;
  email: string;
}

export interface ClienteUpdateDto {
  nombre: string;
  apellido: string;
  telefonoCelular: string;
  email: string;
}
