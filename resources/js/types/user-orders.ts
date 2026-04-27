export type PedidoLineaEstadoColor = 'success' | 'danger' | 'warning';

export type PedidoLineaCliente = {
    id: string;
    order_id: number;
    item_id: number;
    fecha: string;
    producto: string;
    imagen: string;
    precio: string;
    cantidad: number;
    estado: string;
    estado_color: PedidoLineaEstadoColor;
};

export type PedidoLineasPaginadas = {
    data: PedidoLineaCliente[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};
