import * as array from "../../engine/src/util/array";

let cachedCorsSupported: boolean;

export function corsSupported() {
  if (cachedCorsSupported === undefined) {
    try {
      cachedCorsSupported = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
    } catch (e) {
      cachedCorsSupported = false;
    }
  }
  return cachedCorsSupported;
}

const pendingXDR = [];

export class Sender {
  private client;
  private isXDR: boolean = false;

  constructor(crossDomain: boolean = false) {
    if (crossDomain && corsSupported() == false) {
      // @ts-ignore: none
      this.client = new XDomainRequest();
      this.client.status = 200;
      this.client.statusText = "XDomainRequest does not support statusText";
      this.client.onprogress = () => {};
      this.client.setRequestHeader = () => {};
      this.isXDR = true;
      pendingXDR.push(this.client);
    } else {
      this.client = new XMLHttpRequest();
    }
  }

  get(url: string, json?: boolean) {
    this.client.open("GET", url);
    if (json) {
      this.client.responseType = "json";
    }
    return this.send();
  }

  post(url: string, args?: Object, json?: boolean, form: boolean = true) {
    this.client.open("POST", url);
    if (json) {
      this.client.responseType = "json";
    }
    if (args && form) {
      this.client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      return this.send(args, true);
    } else if (args && !form) {
      this.client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      return this.send(args, false);
    }
  }

  private afterDone() {
    if (this.isXDR) {
      array.remove(pendingXDR, this.client);
    }
  }

  private send(args?: Object, form: boolean = true) {
    return new Promise<XMLHttpRequest>((resolve, reject) => {
      setTimeout(() => {
        if (args) {
          if (form) {
          } else {
            this.client.send(JSON.stringify(args));
          }
        } else {
          this.client.send();
        }
      }, 0);
      this.client.onload = () => {
        this.afterDone();
        if (this.client.status >= 200 && this.client.status < 300) {
          resolve(this.client);
        } else {
          reject(new Error(this.client.statusText));
        }
      };
      this.client.ontimeout = () => {
        this.afterDone();
        reject(new Error("Request timeout"));
      };
      this.client.onerror = (e) => {
        this.afterDone();
        reject(new Error(e.toString()));
      };
    });
  }
}

export function get(url, json?: boolean) {
  return new Sender(true).get(url);
}

export function post(url: string, args?, json?: boolean, form: boolean = true) {
  return new Sender(true).post(url, args, json, form);
}

export function parseUri(url: string) {
  const a = document.createElement("a");
  a.href = url;
  return a;
}

export function parseDomain(hostname: string) {
  const host = hostname || "";
  const segs = host.split(".");
  const l = segs.length;
  if (l > 1) {
    return `${segs[l - 2]}.${segs[l - 1]}`;
  }
  return host;
}
