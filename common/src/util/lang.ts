
export interface Type extends Function { new (...args): any; }

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isString(obj: any): obj is string {
  return typeof obj === "string";
}

export function isFunction(obj: any): obj is Function {
  return typeof obj === "function";
}

export function isType(obj: any): obj is Type {
  return isFunction(obj);
}

export function isStringMap(obj: any): boolean {
  return typeof obj === "object" && obj !== null;
}

export function isArray(obj: any): boolean {
  return Array.isArray(obj);
}

export function isNumber(obj): obj is number {
  return typeof obj === "number";
}

export function isDate(obj): obj is Date {
  return obj instanceof Date && !isNaN(obj.valueOf());
}

export function isEmptyObject(obj): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function normalizeBlank(obj: Object): any {
  return isBlank(obj) ? null : obj;
}

export function normalizeBool(obj: boolean): boolean {
  return isBlank(obj) ? false : obj;
}

export function isJsObject(o: any): boolean {
  return o !== null && (typeof o === "function" || typeof o === "object");
}

export function setValueOnPath(global: any, path: string, value: any) {
  let parts = path.split(".");
  let obj: any = global;
  while (parts.length > 1) {
    let name = parts.shift();
    if (obj.hasOwnProperty(name) && isPresent(obj[name])) {
      obj = obj[name];
    } else {
      obj = obj[name] = {};
    }
  }
  if (obj === undefined || obj === null) {
    obj = {};
  }
  obj[parts.shift()] = value;
}

export interface Map<T> {
  [key: string]: T;
}

export function merge(...sources: Object[]): Object {
  let result = {};
  for (let index = 0; index < sources.length; index++) {
    let source = sources[index];
    if (source != null) {
      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          result[key] = source[key];
        }
      }
    }
  }
  return result;
}