export interface Imagen {
    id: string;
    data: string;
    contentTYpe: string;
    usuario: string;
    mail: string;
    tipo: string;
    creada: Date;
    fullPath: string;
    url: string;
    votos: Array<string>;
    color: string;
}
