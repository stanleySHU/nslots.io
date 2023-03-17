export function parse(str: string): Object {
    let ret = Object.create(null);
    str = str.trim().replace(/^(\?|#|&)/, "");
    if (!str) {
      return ret;
    }
    str.split("&").forEach(param => {
      let parts = param.replace(/\+/g, " ").split("=");
      let key = parts.shift();
      let val = parts.length > 0 ? parts.join("=") : undefined;
      key = decodeURIComponent(key);
      val = val === undefined ? null : decodeURIComponent(val);
      if (ret[key] === undefined) {
        ret[key] = val;
      } else if (Array.isArray(ret[key])) {
        ret[key].push(val);
      } else {
        ret[key] = [ret[key], val];
      }
    });
    return ret;
  }

  export function get() {
    return parse(location.search);
  }
  
  export function getParameter(k: string, v?): string {
    let queryString = get();
    return queryString[k] ? queryString[k] : v;
  }