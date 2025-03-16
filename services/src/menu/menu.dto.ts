import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDto, Default } from '../base/base.dto';
import { IMenuItem } from './menu.interface';

@Exclude()
export class MenuItemDto extends BaseDto implements IMenuItem {
    @Expose()
    title!: string;

    @Expose()
    label!: string;

    @Expose()
    href!: string;

    @Expose()
    icon?: string;

    @Expose()
    @Transform((params) => {
        return true;
    })
    active!: boolean;

    @Expose()
    children!: IMenuItem[];

    @Expose()
    @Default([])
    permission!: Array<string>;
}
