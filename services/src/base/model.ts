import {
  ClassTransformOptions,
  plainToInstance,
  instanceToInstance,
  instanceToPlain,
  Transform,
  TransformFnParams,
} from 'class-transformer';
export type ClassType<T> = new (...args: any[]) => T;

export abstract class BaseModel {

  static fromJson<T extends BaseModel, V>(
    this: ClassType<T>,
    plain: V,
    options?: ClassTransformOptions
  ): T {
    return plainToInstance(this, plain, options);
  }

  static createEmpty<T extends BaseModel>(
    this: ClassType<T>,
    options?: ClassTransformOptions
  ): T {
    return plainToInstance(this, {}, options);
  }

  static clone<T extends BaseModel, V extends T>(
    this: ClassType<T>,
    plain: V,
    options?: ClassTransformOptions
  ): T {
    return instanceToInstance(plain, options);
  }

  static merge<T extends BaseModel, V>(
    this: ClassType<T>,
    classObj: T,
    plain: V,
    options?: ClassTransformOptions
  ): T {
    const plainObj = instanceToPlain(classObj);
    const objMerged = Object.assign(plainObj, plain);
    return plainToInstance(this, objMerged, options);
  }
  static toJson<T extends BaseModel, V>(
    this: ClassType<T>,
    classObj: T
  ): Object {
    const plainObj = instanceToPlain(classObj);
    return plainObj;
  }

  /**
   * get value from string path
   *
   * @param classObj data
   * @param path string path
   * get value in object: BaseModel.get('obj.key1')
   * get value in array: BaseModel.get('arr[index]')
   * get value in array object: BaseModel.get('arr[index].key1')
   */
  static get<T extends BaseModel>(
    this: ClassType<T>,
    data: T,
    path: string
  ): any {
    return getByPath(data, path);
  }
}

export function getByPath(obj: Record<string, any>, path: string): any {
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  const paths = path.split('.');
  for (let i = 0, n = paths.length; i < n; ++i) {
    const k = paths[i];
    if (obj && k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

export function Default(defaultValue: boolean): PropertyDecorator;
export function Default(defaultValue: number): PropertyDecorator;
export function Default(defaultValue: string): PropertyDecorator;
export function Default<T extends object>(defaultValue: T): PropertyDecorator;
export function Default<T>(defaultValue: T): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (value !== null && value !== undefined) {
      return value;
    }
    if (typeof defaultValue === 'function') {
      return defaultValue();
    }
    if (Array.isArray(defaultValue)) {
      return [...defaultValue];
    }
    if (typeof defaultValue === 'object') {
      return defaultValue === null ? null : { ...defaultValue };
    }
    return defaultValue;
  });
}
