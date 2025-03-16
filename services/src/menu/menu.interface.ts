export interface IMenuItem {
    title: string;
    label: string;
    href: string;
    icon?: string;
    active?: boolean;
    children: Array<IMenuItem>;
    permission: Array<string>;
}
