import { Map, Type, isBlank, isPresent, isFunction, isString } from "./lang";

export class Injector {
    private static _Obj: Injector;
    static get Obj() {
        if (!this._Obj) {
            this._Obj = new Injector();
        }
        return this._Obj;
    }

  private mappings: Map<InjectionMapping>;

  constructor() {
    this.mappings = {};
  }

  map(key: string, type?: Type) {
    let mapping = new InjectionMapping(key, type);
    this.mappings[key] = mapping;
    return mapping;
  }

  unmap(key: string) {
    this.mappings[key] = undefined;
  }

  get(key: string, ...args) {
    let mapping = this.mappings[key];
    if (isBlank(mapping)) {
      return undefined;
    }
    return mapping.get(args);
  }

  resolve() {
    console.warn("Injector.resolve() is not implement yet");
  }

}

export interface DependencyProvider {
  get(args: any[]);
  destroy();
}

export class ValueProvider implements DependencyProvider {
  constructor(public value: any) { }
  get(args: any[]) { return this.value; }
  destroy() { this.value = undefined; }
}

export class TypeProvider implements DependencyProvider {
  constructor(public type: Type) { }
  get(args: any[]) { return instantiate(this.type, args); };
  destroy() { this.type = undefined; }
}

export class FunctionProvider implements DependencyProvider {
  constructor(public func: Function) { }
  get(...args) { return this.func(...args); };
  destroy() { this.func = undefined; }
}

export class SingletonProvider implements DependencyProvider {
  private instance;
  constructor(private type: Type) { }
  get(args: any[]) {
    if (isBlank(this.instance)) {
      this.instance = instantiate(this.type, args);
    }
    return this.instance;
  }
  destroy() {
    this.type = undefined;
    this.instance = undefined;
  }
}

export interface Factory {
  (args: any[]): any;
}

export class FactoryProvider implements DependencyProvider {
  constructor(private factory: Factory) { }
  get(args: any[]) {
    return this.factory(args);
  }
  destroy() {
    this.factory = undefined;
  }
}

export class InjectionMapping {
  private provider: DependencyProvider;

  constructor(public name: string, public type?: Type) { }

  get(args: any[]) {
    if (isBlank(this.provider)) {
      this.toType(this.type);
    }
    return this.provider.get(args);
  }

  toValue(value) {
    this.destroy();
    this.provider = new ValueProvider(value);
  }

  toType(type: Type) {
    this.destroy();
    this.provider = new TypeProvider(type);
  }

  toSingleton(type: Type) {
    this.destroy();
    this.provider = new SingletonProvider(type);
  }

  asSingleton() {
    this.destroy();
    if (isBlank(this.type)) {
      throw new Error("asSingleton must have a type.");
    }
    this.toSingleton(this.type);
  }

  toFactory(factory: Factory) {
    this.destroy();
    this.provider = new FactoryProvider(factory);
  }

  toFunction(func: Function) {
    this.destroy();
    this.provider = new FunctionProvider(func);
  }

  destroy() {
    if (isPresent(this.provider)) {
      this.provider.destroy();
    }
  }

}

function instantiate(type: Type, args: any[]) {
  let len = args.length;
  switch (len) {
    case 0: return new type();
    case 1: return new type(args[0]);
    case 2: return new type(args[0], args[1]);
    case 3: return new type(args[0], args[1], args[2]);
    case 4: return new type(args[0], args[1], args[2], args[3]);
    case 5: return new type(args[0], args[1], args[2], args[3], args[4]);
    case 6: return new type(args[0], args[1], args[2], args[3], args[4], args[5]);
    case 7: return new type(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    case 8: return new type(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
    case 9: return new type(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
    case 10: return new type(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
    default: throw new Error("only support instantiate maximum 10 arguments!");
  }
}
