/* global TR */

const S = {
  NOT_EXISTS: -2147483648,
  EXISTS: -2147483647,
  WRONG_FILE_EXTENTION: -2147483640,
  INT_TRUE: 1,
  INT_FALSE: 0,
  CSS: {
    addClass: (node: HTMLElement, className: string) => {
      if (S.CSS.hasClass(node, className) === false) {
        node.className += ` ${className}`;
      }
    },

    removeClass: (node: HTMLElement, className: string) => {
      if (node.className === undefined) {
        return;
      }

      let removeCounter = 0;
      const classes = node.className.split(" ");
      const removeClasses = className.split(" ");

      for (let i = classes.length; i-- > 0; ) {
        for (let j = removeClasses.length; j-- > 0; ) {
          if (classes[i] === removeClasses[j]) {
            ++removeCounter;
            classes[i] = S.Strings.EMPTY;
            break;
          }
        }
      }

      if (removeCounter === 0) {
        return;
      }

      const finalClasses = new Array(classes.length - removeCounter);
      removeCounter = 0;
      for (let i = 0; i < classes.length; ++i) {
        if (classes[i] === S.Strings.EMPTY) {
          continue;
        }
        finalClasses[removeCounter++] = classes[i];
      }

      node.className = finalClasses.join(" ");
    },

    hasClass: (node: HTMLElement, className: string) => {
      if (node.className === undefined) {
        return false;
      }

      const classes = node.className.split(" ");
      for (let i = classes.length; i-- > 0; ) {
        if (classes[i] === className) {
          return true;
        }
      }
      return false;
    },

    toggleClass: (node: HTMLElement, className: string) => {
      if (S.CSS.hasClass(node, className) === true) {
        S.CSS.removeClass(node, className);
      } else {
        S.CSS.addClass(node, className);
      }
    },

    isActive: (node: HTMLElement, className: string) => {
      return S.CSS.hasClass(node, "Active");
    },

    getClassName: (active: boolean, className: string) => {
      return active === true ? ` ${className}` : S.Strings.EMPTY;
    },

    getActiveClassName: (active: boolean) => {
      return S.CSS.getClassName(active, "Active");
    },
  },
  Cookie: {
    set: (name: string, value: string, expireDate: Date) => {
      const expires = `; expires=${expireDate.toUTCString()}`;
      document.cookie = `${name}=${value}${expires}; path=/`;
    },

    get: (cookieName: string) => {
      let cookie;
      const cookies = document.cookie.split(";");

      for (let i = cookies.length - 1; i >= 0; --i) {
        cookie = cookies[i].split("=");
        if (cookie[0].trim() === cookieName) {
          return cookie[1];
        }
      }

      return null;
    },

    delete: (name: string) => {
      const expire = new Date();
      expire.setFullYear(expire.getFullYear() - 10);
      document.cookie = `${name}=1; expires=${expire.toUTCString()}; path=/`;
    },
  },
  Strings: {
    EMPTY: "",
    TRUE: "1",
    FALSE: "0",
    NOT_EXISTS: "-2147483648",
    EXISTS: "-2147483647",
  },
  Colors: {
    WHITE: "#fff",
    LIGHT_RED: "#ffd7d7",
    RED: "#f00",
    GRAY128: "#808080",
    GRAY242: "#f2f2f2",
  },
  Browser: {
    FIREFOX: "Firefox",
    OPERA: "Opera",
    CHROME: "Chrome",
    SAFARI: "Safari",
    IE: "IE",
    EDGE: "EDGE",
    UNKNOWN: "un",
    instance_name: null,
    version: null,
  },

  stopPropagation: (e: any) => {
    e.stopPropagation();
  },

  preventDefault: (e: any) => {
    e.preventDefault();
  },

  getX: (node: HTMLElement | null) => {
    let x = 0;
    while (node) {
      x += node.offsetLeft;
      node = node.offsetParent as HTMLElement;
    }
    return x;
  },

  getY: (node: HTMLElement | null) => {
    let x = 0;
    while (node) {
      x += node.offsetLeft;
      node = node.offsetParent as HTMLElement;
    }
    return x;
  },

  getScreenX: (object: Element) => {
    return object.getBoundingClientRect().left;
  },

  getScreenY: (object: Element) => {
    return object.getBoundingClientRect().top;
  },

  getScrollY:
    window.scrollY !== undefined
      ? () => {
          return window.scrollY;
        }
      : () => {
          return document.documentElement.scrollTop;
        },
  getScrollX:
    window.scrollX !== undefined
      ? () => {
          return window.scrollX;
        }
      : () => {
          return document.documentElement.scrollLeft;
        },

  setScrollY: (value: number) => {
    window.scrollTo(S.getScrollX(), value);
  },

  parseQueryString: (query: string) => {
    const vars = query.split("&");
    const queryString: any = {};
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      // If first entry with this name
      if (typeof queryString[pair[0]] === "undefined") {
        queryString[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof queryString[pair[0]] === "string") {
        const arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
        queryString[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        queryString[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return queryString;
  },

  getChildrenHeight: (parent: HTMLElement) => {
    const children = parent.children;
    let h = 0,
      testH;
    for (let i = children.length; i-- > 0; ) {
      if (children[i].tagName === undefined) {
        continue;
      }
      testH = S.getScreenY(children[i]) + children[i].offsetHeight;
      if (testH > h) {
        h = testH;
      }
    }
    return h - S.getScreenY(parent);
  },
};

String.prototype.replaceAllChar = function replaceAllChar(
  searchChar: string,
  replaceChar: string
) {
  let lastReplace = -1;
  let result = "";
  const size = this.length;

  for (let i = 0; i < size; ++i) {
    if (this[i] === searchChar) {
      result += this.substring(lastReplace + 1, i) + replaceChar;
      lastReplace = i;
    }
  }

  result += this.substring(lastReplace + 1);
  return result;
};

String.prototype.replaceAll = function replaceAll(
  search: string,
  replace: string
) {
  const len = search.length;
  let result = "";
  let startIndex = 0;
  let index;

  for (;;) {
    index = this.indexOf(search, startIndex);
    if (index === -1) {
      result += this.substring(startIndex);
      break;
    }
    result += this.substring(startIndex, index) + replace;
    startIndex = index + len;
  }

  return result;
};

String.prototype.replaceAt = function replaceAt(
  index: number,
  character: string
) {
  return (
    this.substring(0, index) +
    character +
    this.substring(index + character.length)
  );
};

Number.prototype.formatSpace = function formatSpace(space: number) {
  const result = "0".repeat(space);
  return (result + this.toString()).substr(-space);
};

Date.prototype.formatCalendarDate = function formatCalendarDate(
  words: boolean
) {
  if (words === undefined) {
    words = false;
  }

  return `${this.getDate().formatSpace(2)} ${this.formatMonth(words)} ${this.getFullYear()}`;
};

Date.prototype.formatCalendarTime = function formatCalendarTime() {
  return `${this.getHours().formatSpace(2)}:${this.getMinutes().formatSpace(2)}`;
};

Date.prototype.formatCalendarDateAndTime = function formatCalendarDateAndTime(
  words: boolean
) {
  if (words === undefined) {
    words = false;
  }

  return `${this.formatCalendarDate(words)}, ${this.formatCalendarTime()}`;
};

Date.prototype.formatMonth = function formatMonth(words: boolean) {
  if (words === undefined) {
    words = false;
  }

  if (words === false) {
    return (this.getMonth() + 1).formatSpace(2);
  }

  switch (this.getMonth()) {
    default:
    case 0:
      return TR.MONTH_JANUARY;
    case 1:
      return TR.MONTH_FEBRUARY;
    case 2:
      return TR.MONTH_MARCH;
    case 3:
      return TR.MONTH_APRIL;
    case 4:
      return TR.MONTH_MAY;
    case 5:
      return TR.MONTH_JUNE;
    case 6:
      return TR.MONTH_JULY;
    case 7:
      return TR.MONTH_AUGUST;
    case 8:
      return TR.MONTH_SEPTEMBER;
    case 9:
      return TR.MONTH_OCTOMBER;
    case 10:
      return TR.MONTH_NOVEMBER;
    case 11:
      return TR.MONTH_DECEMBER;
  }
};

Date.prototype.clearTime = function clearTime() {
  this.setHours(0);
  this.setMinutes(0);
  this.setSeconds(0);
  this.setMilliseconds(0);
};

Date.prototype.clear = function clear() {
  this.clearTime();
  this.setYear(1970);
  this.setMonth(0);
  this.setDate(1);
};

Date.prototype.setDay = function setDay(day: number) {
  this.setDate(this.getDate() + (day - this.getDay()));
};

Array.prototype.removeElement = function removeElement(
  element: any,
  cmp: (t1: any, t2: any) => boolean
) {
  for (let i = this.length; i-- > 0; ) {
    if (cmp !== undefined) {
      if (cmp(this[i], element) === true) {
        this.splice(i, 1);
        break;
      }
    } else if (this[i] === element) {
      this.splice(i, 1);
      break;
    }
  }
};

Array.prototype.pushIfNotExist = function pushIfNotExist(
  element: any,
  cmp: (t1: any, t2: any) => boolean
) {
  let push = true;
  for (let i = this.length; i-- > 0; ) {
    if (cmp !== undefined) {
      if (cmp(this[i], element) === true) {
        push = false;
        break;
      }
    } else if (this[i] === element) {
      push = false;
      break;
    }
  }

  if (push === true) {
    this.push(element);
  }

  return push;
};

Array.prototype.last = function last() {
  return this.length === 0 ? null : this[this.length - 1];
};

Array.prototype.equals = function equals(target: any) {
  if (this === target) {
    return true;
  }

  if (target.length === undefined) {
    return false;
  }

  if (this.length !== target.length) {
    return false;
  }

  for (let i = this.length; i-- > 0; ) {
    if (this[i] === undefined && target[i] === undefined) {
      continue;
    }
    if (this[i] === undefined || target[i] === undefined) {
      return false;
    }

    if (this[i].equals !== undefined && target[i].equals !== undefined) {
      if (this[i].equals(target[i]) === false) {
        return false;
      }
    } else if (this[i] !== target[i]) {
      return false;
    }
  }

  return true;
};

Array.prototype.clone = function clone() {
  const result = new Array(this.length);

  for (let i = this.length; i-- > 0; ) {
    result[i] = this[i].clone !== undefined ? this[i].clone() : this[i];
  }

  return result;
};

Array.prototype.replace = function replace(
  target: any,
  cmp: (t1: any, t2: any) => boolean
) {
  for (let i = this.length; i-- > 0; ) {
    if (cmp(this[i], target) === true) {
      this[i] = target;
      break;
    }
  }
};

Array.prototype.shuffle = function shuffle() {
  let i = this.length;
  let j;
  let temp;

  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

Map.prototype.clone = function clone() {
  const result = new Map();

  this.forEach((value, key) => {
    result.set(key, value.clone !== undefined ? value.clone() : value);
  });

  return result;
};

Map.prototype.equals = function equals(map: Map<any, any>) {
  if (this.size !== map.size) {
    return false;
  }

  let isEquals = true;
  this.forEach((value, key) => {
    if (this.get(key) !== map.get(key)) {
      isEquals = false;
    }
  });

  return isEquals;
};

Map.fromObject = (obj: any) => {
  const map = new Map();

  // eslint-disable-next-line guard-for-in
  const keys = Object.keys(obj);
  for (let i = keys.length; i-- > 0; ) {
    map.set(keys[i], obj[keys[i]]);
  }

  return map;
};

Map.toObject = (map: Map<any, any>) => {
  const result: any = {};

  map.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

function initBrowser() {
  let browser;
  let browserVersion = "";
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf("Edge") >= 0) {
    browser = S.Browser.EDGE;
  } else if (userAgent.indexOf("Firefox") >= 0) {
    browser = S.Browser.FIREFOX;
  } else if (userAgent.indexOf("OPR") >= 0) {
    browser = S.Browser.OPERA;
  } else if (userAgent.indexOf("hrome") >= 0) {
    browser = S.Browser.CHROME;
  } else if (userAgent.indexOf("afari") >= 0) {
    browser = S.Browser.SAFARI;
  } else {
    let versionPosition = S.NOT_EXISTS;

    if (userAgent.indexOf("MSIE") >= 0) {
      versionPosition = userAgent.indexOf("MSIE") + 4;
    } else if (userAgent.indexOf(".NET") >= 0) {
      versionPosition = userAgent.indexOf("rv:") + 3;
    }

    if (versionPosition !== S.NOT_EXISTS) {
      browser = S.Browser.IE;
      while (userAgent.charAt(versionPosition) === " ") {
        ++versionPosition;
      }

      do {
        browserVersion += userAgent.charAt(versionPosition++);
      } while (
        userAgent.charAt(versionPosition) >= "0" &&
        userAgent.charAt(versionPosition) <= "9"
      );
    } else {
      browser = S.Browser.UNKNOWN;
    }
  }

  S.Browser.instance_name = browser;
  S.Browser.version = browserVersion;
}

// eslint-disable-next-line func-names
(function () {
  initBrowser();
})();

export default S;
