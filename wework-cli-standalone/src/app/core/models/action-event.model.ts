export interface ActionEventModel {
    action: {
        label: string;
        name: string;
    };
    data?: any; // opcional, cuando la acción requiere pasar datos
}
