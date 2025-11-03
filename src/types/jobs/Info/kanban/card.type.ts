export type KanbanAction = {
    id: string
    label: string
    icon:
    | "chat"
    | "reject"
    | "interview"
    | "interview_b"
    | "selected"
    | "view"
    | "work_order"
    | "work_order_pencil"
    | "work_order_pencil_b"
    | "onboard"
    | "offer"
    | "offer_pencil"
}

export type StageActionMap = Record<
    string,
    {
        _default?: KanbanAction[]
        [status: string]: KanbanAction[] | undefined
    }
>