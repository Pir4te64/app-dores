export class Banner {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  link: string;
  fechaInicio: [number, number, number];
  fechaFin: [number, number, number];
  activo: boolean;
  orden: number;
  softDelete: boolean;
  created_at: string;
  updated_at: string;

  constructor(
    id: number,
    titulo: string,
    descripcion: string,
    imagen: string,
    link: string,
    fechaInicio: [number, number, number],
    fechaFin: [number, number, number],
    activo: boolean,
    orden: number,
    softDelete: boolean,
    created_at: string,
    updated_at: string
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.link = link;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.activo = activo;
    this.orden = orden;
    this.softDelete = softDelete;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
