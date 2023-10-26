var L = Object.defineProperty;
var T = (m, e, t) => e in m ? L(m, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : m[e] = t;
var C = (m, e, t) => (T(m, typeof e != "symbol" ? e + "" : e, t), t);
function j() {
  window.bodySize = document.body.offsetWidth >= 750 ? "desktop" : "mobile";
  let m = [];
  const e = (s, a) => {
    const n = new CustomEvent("body:resized", {
      detail: {
        size: s
      }
    });
    if (a) {
      a.dispatchEvent(n);
      return;
    }
    m.forEach((o) => o.dispatchEvent(n));
  };
  return new ResizeObserver((s) => {
    s.forEach((a) => {
      const n = a.contentRect.width;
      n < 750 && window.bodySize === "mobile" || (n < 750 && window.bodySize !== "mobile" ? (window.bodySize = "mobile", e(window.bodySize)) : n > 750 && window.bodySize !== "desktop" && (window.bodySize = "desktop", e(window.bodySize)));
    });
  }).observe(document.body), {
    subscribe: (s, a) => {
      m.push(s), a && s.addEventListener("body:resized", a), e(window.bodySize, s);
    },
    unsubscribe: (s) => {
      m = m.filter((a) => a !== s);
    }
  };
}
const V = j();
function B() {
  let m = [];
  return window.addEventListener("click", (t) => {
    m.map((s) => (s.target !== t.target && !s.target.contains(t.target) && s.opener !== t.target && (s.opener ? !s.opener.contains(t.target) : !0) && (s.callback(), s.closed = !0), s)), m = m.filter((s) => !s.closed);
  }), ({ target: t, opener: s, callback: a }) => {
    m.push({
      target: t,
      opener: s,
      callback: a
    });
  };
}
B();
const y = class y {
  constructor(e) {
    this.editList = document.querySelector(y.selectors.editList), this.timer = {
      in: null,
      out: null
    }, this.container = document.createElement("div"), this.container.classList.add("tool", "page__tool"), this.icon = (() => {
      const t = document.createElement("span");
      return t.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M6.798 2.884a7.002 7.002 0 0 1 9.294 8.565l4.394 3.718a3.76 3.76 0 1 1-5.3 5.3l-3.717-4.394a7.002 7.002 0 0 1-8.565-9.295c.358-.894 1.48-1.007 2.063-.373L8.17 9.883l1.446-.288l.29-1.449l-3.48-3.198c-.634-.583-.522-1.706.373-2.064ZM8.805 4.42l2.763 2.54c.322.296.466.738.38 1.165l-.47 2.354a1.25 1.25 0 0 1-.982.981l-2.35.467a1.25 1.25 0 0 1-1.164-.38L4.438 8.785a5.002 5.002 0 0 0 6.804 5.25a1.257 1.257 0 0 1 1.422.355l4.05 4.786a1.76 1.76 0 1 0 2.48-2.48l-4.785-4.05a1.257 1.257 0 0 1-.355-1.422a5.001 5.001 0 0 0-5.25-6.804Z"/></g></svg>
      `, {
        container: t,
        setIcon: (s) => t.innerHTML = s
      };
    })(), this.label = this.initLabel("Label"), e && this.label.setLabel(e), this.dropdownIcon = (() => {
      const t = `
        <svg class="tool__plus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="black"/>
        </svg>
      `, s = `
        <svg class="tool__minus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="black"/>
        </svg>
      `, a = document.createElement("span");
      return a.classList.add("tool__dropdown"), a.innerHTML = t + s, a;
    })(), this.trigger = (() => {
      const t = document.createElement("div");
      t.classList.add("tool__trigger");
      const s = document.createElement("div");
      return s.classList.add("tool__info"), s.append(this.icon.container), s.append(this.label.title), t.append(s), t.append(this.dropdownIcon), t.addEventListener("click", this.toggle.bind(this)), t;
    })(), this.container.append(this.trigger), this.collapsible = (() => {
      const t = document.createElement("div");
      t.classList.add("tool__collapsible");
      const s = document.createElement("div");
      return s.classList.add("tool__collapsible-inner"), t.append(s), this.container.append(t), {
        container: t,
        inner: s
      };
    })(), this.setContent();
  }
  open() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + "px", clearTimeout(this.timer.in), clearTimeout(this.timer.out), this.timer.in = setTimeout(() => {
      this.collapsible.container.style.height = "auto";
    }, 500), this.container.toggleAttribute("data-open");
  }
  close() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + "px", clearTimeout(this.timer.in), clearTimeout(this.timer.out), this.timer.out = setTimeout(() => {
      this.collapsible.container.style.height = null, this.container.removeAttribute("data-open");
    }, 10);
  }
  toggle() {
    this.container.hasAttribute("data-open") ? this.close() : this.open();
  }
  setContent() {
    const e = document.createElement("div");
    e.textContent = "Content", this.collapsible.inner.append(e);
  }
  initLabel(e) {
    const t = document.createElement("span");
    return t.classList.add("tool__title"), t.textContent = e, {
      title: t,
      setLabel: (s) => {
        t.textContent = s, this.container.setAttribute("data-tool", s);
      }
    };
  }
  setOnCreate(e) {
    e && this.setValue(e);
  }
  setValue(e) {
    return e;
  }
  getValue() {
    return {
      value: "Content"
    };
  }
  isExists() {
    return document.contains(this.container);
  }
  create(e) {
    this._defaultCreate(e);
  }
  _defaultCreate(e) {
    this.container.style.opacity = 0, this.editList.append(this.container), setTimeout(() => {
      this.container.style.opacity = null, this.setOnCreate(e);
    }, 300);
  }
  remove() {
    this.container.style.opacity = 0, setTimeout(() => {
      this.container.style.opacity = null, this.container.remove();
    }, 300);
  }
  exists() {
    return document.contains(this.container);
  }
  reset() {
    this.close(), this.setValue("Content");
  }
};
C(y, "selectors", {
  editList: "[data-tools-list]"
});
let x = y;
var w;
let H = (w = class extends x {
  constructor() {
    super(), this.container.classList.add("center"), this.label.setLabel(localization.tools.text.title);
    const e = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95078 2.9498L3.95078 4.49977C3.95078 4.74829 3.74931 4.94977 3.50078 4.94977C3.25225 4.94977 3.05078 4.74829 3.05078 4.49977V2.49982C3.05078 2.45225 3.05816 2.4064 3.07185 2.36336C3.12963 2.18154 3.29983 2.0498 3.50079 2.0498H11.5008C11.6561 2.0498 11.7931 2.1285 11.8739 2.24821C11.9225 2.32003 11.9508 2.40661 11.9508 2.4998L11.9508 2.49982V4.49977C11.9508 4.74829 11.7493 4.94977 11.5008 4.94977C11.2523 4.94977 11.0508 4.74829 11.0508 4.49977V2.9498H8.05079V12.0498H9.25513C9.50366 12.0498 9.70513 12.2513 9.70513 12.4998C9.70513 12.7483 9.50366 12.9498 9.25513 12.9498H5.75513C5.50661 12.9498 5.30513 12.7483 5.30513 12.4998C5.30513 12.2513 5.50661 12.0498 5.75513 12.0498H6.95079V2.9498H3.95078Z" fill="black"/>
      </svg>
    `;
    this.icon.setIcon(e);
  }
  selectorTemplate(e) {
    if (!e && !e.options)
      return;
    const t = document.createElement("div");
    t.classList.add("text-tool__selector-wrapper");
    const s = document.createElement("select");
    s.classList.add("text-tool__selector"), e.options.map((o) => {
      const i = document.createElement("option");
      return i.value = o, i.textContent = o, s.append(i), i;
    }), t.append(s);
    const a = `
      <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.01493 3.57255L0.359375 0.916992H5.67049L3.01493 3.57255Z" fill="#888888"/>
      </svg>
    `, n = domReader.parseFromString(a, "image/svg+xml").querySelector("svg");
    return t.append(n), {
      wrapper: t,
      disable: () => s.toggleAttribute("disabled"),
      setValue: (o) => {
        s.querySelector(`option[value="${o}"]`) && (s.value = o);
      },
      getValue: () => s.value,
      selector: s,
      onChange: (o) => {
        s.addEventListener("change", o.bind(this));
      }
    };
  }
  setContent() {
    const e = document.createElement("div");
    this.contentWrapper = e, e.classList.add("text-tool");
    const t = document.createElement("textarea");
    t.classList.add("text-tool__text"), t.addEventListener("input", this.onTextInput.bind(this));
    const s = this.header = this.headerContent(), a = this.tools = this.toolsContent();
    e.append(
      s.wrapper,
      a.container,
      t
    ), this.text = t, this.values = {
      font: this.selectFont.getValue(),
      text: t.value,
      align: a.getAlign(),
      fontStyle: a.getFontStyle()
    }, this.collapsible.inner.append(e);
  }
  headerContent() {
    const e = document.createElement("div");
    e.classList.add("text-tool__header");
    const t = this.selectorTemplate({ options: w.fonts });
    return this.selectFont = t, e.append(t.wrapper), t.onChange(this.onFontChange), {
      wrapper: e,
      selectFont: {
        selector: t.selector,
        value: t.value
      }
    };
  }
  toolsContent() {
    this.groupButtons = {
      align: ["left", "center", "right"]
    };
    const e = document.createElement("div");
    e.classList.add("text-tool__tools");
    const t = document.createElement("div");
    t.classList.add("text-tool__text-style", "text-tool__item");
    const s = (l, p, v, b) => {
      const c = document.createElement("button");
      return c.classList.add("text-tool__button"), c.setAttribute("data-button-value", l), c.innerHTML = p, b && c.classList.add("is-active"), v && c.setAttribute("data-button-group", v), c.addEventListener("click", () => {
        if (c.hasAttribute("data-button-group")) {
          const g = this.contentWrapper.querySelector(`button[data-button-group="${v}"].is-active`);
          g && g.classList.remove("is-active");
        }
        c.classList.toggle("is-active"), this.onToolsChange(c);
      }), c;
    }, a = s("bold", w.icons.bold), n = s("italic", w.icons.italic), o = s("underline", w.icons.underline);
    t.append(a, n, o);
    const i = document.createElement("div");
    i.classList.add("text-tool__text-align", "text-tool__item");
    const r = s("left", w.icons.left, "align"), u = s("center", w.icons.center, "align", !0), d = s("right", w.icons.right, "align");
    return i.append(r, u, d), e.append(t, i), {
      container: e,
      getAlign: () => {
        const l = i.querySelector('button.is-active[data-button-group="align"');
        return l ? l.dataset.buttonValue : null;
      },
      setAlign: (l) => {
        const p = e.querySelector('button[data-button-group="align"].is-active');
        p && p.classList.remove("is-active");
        const v = e.querySelector(`button[data-button-value="${l}"`);
        v && v.classList.add("is-active");
      },
      getFontStyle: () => {
        const l = t.querySelector('button.is-active[data-button-value="bold"'), p = t.querySelector('button.is-active[data-button-value="italic"'), v = t.querySelector('button.is-active[data-button-value="underline"');
        return {
          bold: !!l,
          italic: !!p,
          underline: !!v
        };
      },
      setFontStyle: ({ bold: l, italic: p, underline: v }) => {
        l ? a.classList.add("is-active") : a.classList.remove("is-active"), p ? n.classList.add("is-active") : n.classList.remove("is-active"), v ? o.classList.add("is-active") : o.classList.remove("is-active");
      }
    };
  }
  onToolsChange(e) {
    if (e.hasAttribute("data-button-group")) {
      switch (e.dataset.buttonGroup) {
        case "align":
          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                text: {
                  ...Studio.state.panel.tools.text,
                  value: this.getStateValue({ align: e.dataset.buttonValue })
                }
              }
            }
          }, "text tool");
          break;
      }
      return;
    }
    const t = this.tools.getFontStyle();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ fontStyle: t })
          }
        }
      }
    }, "font style changed");
  }
  onFontChange() {
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ font: this.selectFont.getValue() })
          }
        }
      }
    }, "font change");
  }
  onTextInput(e) {
    this.text.style.height = this.text.scrollHeight + "px";
    const t = Studio.state.view.blocks.filter((i) => i.selected || i.activeChild).some((i) => i.childBlocks.some((r) => r.isLine)), s = Math.min(...Studio.state.view.blocks.filter((i) => i.selected || i.activeChild).filter((i) => i.childBlocks.some((r) => r.type === "text")).map((i) => i.childBlocks.filter((r) => r.type === "text" && r.lines)).reduce((i, r) => [...i, ...r], []).map((i) => i.lines)), a = this.text.value.split(`
`).length;
    s && s < a && (this.text.value = this.text.value.split(`
`).filter((i) => i).filter((i, r) => r < s).join(`
`));
    const { value: n } = this.text, o = this.maxSize !== 1 / 0 ? this.maxSize : t ? 20 : 300;
    if (s) {
      const i = n.split(`
`).map((r) => r.length > o ? r.substring(0, o) : r.split("").filter((d) => d.toLowerCase() === "w").length > 5 ? r.substring(0, o - 5) : r).join(`
`);
      this.text.value = i, this.text.focus(), this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    } else
      n.length > o && t ? (this.text.value = n.substring(0, o), this.text.focus(), this.text.setSelectionRange(this.text.value.length, this.text.value.length)) : !t && n.length > o && (this.text.value = n.substring(0, o), this.text.focus(), this.text.setSelectionRange(this.text.value.length, this.text.value.length));
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ text: this.text.value })
          }
        }
      }
    }, "text tool - on text input");
  }
  getStateValue(e) {
    return {
      ...Studio.state.panel.tools.text.value,
      ...e
    };
  }
  setValue(e) {
    Studio.state.view.blocks.filter((i) => i.selected || i.activeChild).some((i) => i.childBlocks.some((r) => r.isLine));
    const t = Studio.state.view.blocks.filter((i) => i.activeChild || i.selected).map(
      (i) => i.childBlocks.filter(
        (r) => r.type === "text" && r.maxSize && typeof r.maxSize == "number"
      )
    ).map((i) => i.map((r) => r.maxSize)).reduce((i, r) => [...i, ...r], []);
    this.maxSize = Math.min(...t);
    const { text: s, fontStyle: a, align: n, font: o } = e;
    typeof s == "string" && (this.text.value = s), n && (this.tools.setAlign(n), this.container.classList.remove("center", "right", "left"), this.container.classList.add(n)), a && this.tools.setFontStyle(a), o && this.selectFont.setValue(o);
  }
  getValue() {
    return {
      text: this.values.text,
      align: this.values.align,
      fontStyle: this.values.fontStyle,
      font: this.values.font,
      maxSize: this.maxSize
    };
  }
  reset() {
    this.close(), Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: w.defaultValue
          }
        }
      }
    }, "text tool - reset");
  }
}, C(w, "icons", {
  bold: `
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.183181 10.8809V0.347155H4.41171C5.50521 0.347155 6.33787 0.602973 6.9097 1.11461C7.49156 1.61622 7.7825 2.26329 7.7825 3.05582C7.7825 3.71794 7.60192 4.24964 7.24076 4.65093C6.88964 5.04218 6.45826 5.30803 5.94662 5.44848C6.54855 5.56886 7.04514 5.86983 7.43639 6.35137C7.82764 6.82288 8.02327 7.37464 8.02327 8.00666C8.02327 8.83933 7.7223 9.52653 7.12038 10.0683C6.51845 10.61 5.66572 10.8809 4.56219 10.8809H0.183181ZM2.10934 4.77131H4.1258C4.66753 4.77131 5.08386 4.64591 5.37479 4.39511C5.66572 4.1443 5.81119 3.78817 5.81119 3.32669C5.81119 2.88528 5.66572 2.53917 5.37479 2.28837C5.09389 2.02753 4.66753 1.89711 4.0957 1.89711H2.10934V4.77131ZM2.10934 9.31585H4.26123C4.83306 9.31585 5.27447 9.18543 5.58547 8.9246C5.90649 8.65373 6.06701 8.27753 6.06701 7.79599C6.06701 7.30442 5.90148 6.91818 5.57042 6.63728C5.23936 6.35638 4.79293 6.21593 4.23113 6.21593H2.10934V9.31585Z" fill="currentColor"/>
      </svg>
    `,
  italic: `
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7.21094" y="4.57031" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="4.25781" y="12.6836" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="6.47656" y="13.6055" width="9.24965" height="1.47531" transform="rotate(-65 6.47656 13.6055)" fill="currentColor"/>
      </svg>
    `,
  underline: `    
      <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4.57031V10.1027C6 10.1027 6.36883 12.6845 8.95062 12.6845C11.5324 12.6845 11.9012 10.1027 11.9012 10.1027V4.57031" stroke="currentColor" stroke-width="1.77037"/>
        <rect x="3.05469" y="15.6367" width="11.8025" height="1.47531" fill="currentColor"/>
      </svg>
    `,
  left: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.664062 3.01172H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 6.16016H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 9.30859H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 12.457H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  center: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.07031 3.01172H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 6.16016H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.07031 9.30859H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 12.457H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
  right: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.476562 3.01172H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 6.16016H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.476562 9.30859H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 12.457H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
}), C(w, "fonts", [
  "Roboto",
  "Mooli",
  "Inter",
  "Skranji",
  "Quicksand",
  "Lobster Two",
  "DM Sans"
]), C(w, "defaultValue", {
  align: "center",
  font: w.fonts[0],
  fontStyle: {
    bold: !1,
    italic: !1,
    underline: !1
  },
  text: ""
}), w);
function A() {
  let m = 0;
  const e = (o) => {
    let i = "";
    const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", u = r.length;
    let d = 0;
    for (; d < o; )
      i += r.charAt(Math.floor(Math.random() * u)), d += 1;
    return i;
  };
  return {
    childBlock: () => {
      let o;
      do
        o = "childBlock-" + m++;
      while (document.querySelector(StudioView.selectors.childBlockById(o)));
      return o;
    },
    block: () => {
      let o;
      do
        o = "block-" + m++;
      while (document.querySelector(StudioView.selectors.childBlockById(o)));
      return o;
    },
    draft: () => {
      let o = "";
      for (let i = 0; i < 20; i++)
        o += Math.round(Math.random() * 10);
      return o;
    },
    anonim: () => Date.now() + "-" + e(5)
  };
}
const E = A();
({
  ...Array.from(Array(100), (m, e) => e + 1).reduce((m, e) => (m["Set of " + e] = e, m), {})
});
const O = {
  productId: null,
  product: null,
  view: {
    product: null,
    blocks: [],
    blockCount: 0,
    imagesToDownload: null
  },
  panel: {
    product: null,
    blockCount: 0,
    tools: {
      layout: {
        show: !0
      },
      text: {
        show: !1
      }
    }
  }
}, k = class k extends HTMLElement {
  static get observedAttributes() {
    return ["state"];
  }
  constructor() {
    super(), V.subscribe(this, (t) => {
      const { size: s } = t.detail;
      switch (s) {
        case "desktop":
          this.classList.add("desktop"), this.classList.remove("mobile");
          break;
        case "mobile":
          this.classList.add("mobile"), this.classList.remove("desktop");
      }
    }), this.asyncExpectants = [];
    const e = localStorage.getItem("instToRedirect");
    if (e)
      return this.redirectFromInst(e);
    this.panel = this.querySelector(k.selectors.panel), this.studioView = this.querySelector(k.selectors.studioView), this.draft = {}, localStorage.getItem("product-builder-draft") ? this.draft = JSON.parse(localStorage.getItem("product-builder-draft")) : this.draft.id = E.draft(), this.errorToast = document.querySelector(k.selectors.errorToast), this.relatedProducts = document.querySelector(k.selectors.relatedProducts), this.init();
  }
  attributeChangedCallback(e, t, s) {
    const a = JSON.parse(t), n = JSON.parse(s);
    if (this.draft.state = n, this.state = { ...n }, !compareObjects(a, n)) {
      if (!productParams.get("id") && !productParams.get("project-id") && !n.product && this.panel.tools.focusOnTab("products"), a.productId !== n.productId && !n.product) {
        const o = new URL(location.href);
        o.searchParams.get("id") !== n.productId && (o.searchParams.delete("id"), o.searchParams.append("id", n.productId), history.replaceState({}, "", o)), this.getProduct(n.productId).then((i) => {
          this.product = i, Studio.utils.change({
            product: i
          });
        }, "set product");
      }
      if (!compareObjects(a.product, n.product) && n.product && (this.product = n.product, this.draft.product = n.product, this.relatedProducts.init(), this.panel.setState({ product: n.product })), !compareObjects(a.panel, n.panel) && (this.panel.setState(n.panel), a.panel.blockCount !== n.panel.blockCount && n.panel.blockCount !== n.view.blocks.length && n.product.quantity.type === "set-of" && n.view.blocks.length > 0)) {
        const { blocks: o } = n.view, i = n.panel.blockCount;
        if (a.panel.blockCount < i) {
          const r = Array(i - a.panel.blockCount).fill(null).map((u) => this.studioView.getBlockJSON());
          Studio.utils.change({
            view: {
              ...n.view,
              blocks: [...o, ...r]
            }
          }, "block count set of - increase");
        } else
          a.panel.blockCount > i && Studio.utils.change({
            view: {
              ...n.view,
              blocks: o.slice(0, i)
            }
          }, "block count set of - decrease");
      }
      if (!compareObjects(a.imagesToDownload, n.imagesToDownload))
        if (!n.imagesToDownload)
          this.studioView.setState({ imagesToDownload: null });
        else if (typeof n.imagesToDownload == "string") {
          const o = n.view.blocks.filter((i) => i.activeChild).map((i, r) => {
            const u = i.childBlocks.filter((l) => l.selected).map((l) => l.id), d = n.imagesToDownload;
            return typeof d == "string" ? {
              pictureIds: u,
              imageUrl: d
            } : null;
          }).filter((i) => i);
          if (!o.length) {
            const i = n.view.blocks.find((r) => r.childBlocks.filter((u) => u.type === "editable-picture").every((u) => !u.imageUrl));
            if (i) {
              const r = n.imagesToDownload, u = i.childBlocks.filter((d) => d.type === "editable-picture").map((d) => d.id);
              o.push({
                pictureIds: u,
                imageUrl: r
              });
            }
          }
          this.studioView.setState({ imagesToDownload: o });
        } else {
          const o = n.imagesToDownload.filter((i) => typeof i != "string" && typeof i == "object");
          this.studioView.setState({ imagesToDownload: o });
        }
      if (!compareObjects(a.view, n.view)) {
        this.onViewChange(a, n);
        const o = n.view.blocks.reduce((r, u) => u.childBlocks.filter((l) => l.type === "editable-picture").every((l) => l.imageUrl) ? r + u.count : r, 0), i = n.view.blocks.reduce((r, u) => r + u.count, 0);
        this.panel.productInfo.setCompleteCount(o, i);
      }
      if (this.product && !compareObjects(a.panel.tools, n.panel.tools)) {
        const { tools: o } = n.panel, { blocks: i } = n.view, r = i.some((d) => d.selected), u = i.some((d) => d.activeChild);
        if (!(!r && !u))
          if (!r && u) {
            const { product: d } = n, l = i.map((p) => {
              if (p.activeChild) {
                let v = { ...p.settings };
                if (d && d.type.id !== "photobook")
                  for (const c in p.settings)
                    o[c] && (v[c] = o[c].value);
                const b = p.childBlocks.map((c) => {
                  if (d && d.type.id !== "photobook") {
                    const { settings: g } = c;
                    let f = {};
                    if (c.type === "text")
                      f = o.text.value;
                    else {
                      for (const h in g)
                        o[h] ? h === "backgroundColor" && v.backgroundColor ? f[h] = {
                          value: v.backgroundColor.value
                        } : f[h] = o[h].value : h === "move" && (f[h] = g[h]);
                      (g.crop.value !== f.crop.value || g.rotate.value !== f.rotate.value) && (f.move = {
                        x: 0,
                        y: 0
                      });
                    }
                    return {
                      ...c,
                      settings: f
                    };
                  } else if (c.selected) {
                    const { settings: g } = c;
                    let f = {};
                    if (c.type === "text")
                      f = o.text.value;
                    else {
                      for (const h in g)
                        o[h] ? h === "backgroundColor" && p.settings.backgroundColor ? f[h] = {
                          value: p.settings.backgroundColor.value
                        } : f[h] = o[h].value : h === "move" && (f[h] = g[h]);
                      (g.crop.value !== f.crop.value || g.rotate.value !== f.rotate.value) && (f.move = {
                        x: 0,
                        y: 0
                      });
                    }
                    return {
                      ...c,
                      settings: f
                    };
                  }
                  return c;
                });
                return {
                  ...p,
                  childBlocks: b,
                  settings: v
                };
              }
              return p;
            });
            this.studioView.setState({ blocks: l });
          } else {
            const d = i.map((l) => {
              if (l.selected) {
                const { settings: p } = l, { product: v } = n, b = {};
                let c = l.childBlocks;
                for (const g in p)
                  b[g] = o[g].value;
                return v.type.id === "photobook" ? b.backgroundColor && (c = c.map((g) => {
                  const f = { ...g.settings };
                  return f.backgroundColor && (f.backgroundColor = {
                    value: b.backgroundColor.value
                  }), {
                    ...g,
                    settings: f
                  };
                })) : c = c.map((g) => {
                  const { settings: f } = g;
                  let h = { ...f };
                  if (g.type === "text")
                    h = o.text.value;
                  else {
                    for (const S in h)
                      o[S] ? S === "backgroundColor" && l.settings.backgroundColor ? h[S] = {
                        value: l.settings.backgroundColor.value
                      } : h[S] = o[S].value : S === "move" && (h[S] = f[S]);
                    (p.crop && p.crop.value !== h.crop.value || p.rotate && p.rotate.value !== h.rotate.value) && (h.move = {
                      x: 0,
                      y: 0
                    });
                  }
                  return {
                    ...g,
                    settings: h
                  };
                }), {
                  ...l,
                  childBlocks: c,
                  settings: b
                };
              }
              return l;
            });
            this.studioView.setState({ blocks: d });
          }
      }
      this.asyncExpectants = this.asyncExpectants.filter((o) => (typeof o == "function" && o(), !1));
    }
  }
  onViewChange(e, t) {
    if (t.product && t.product.quantity.type === "set-of" && Studio.panel.productInfo.elements.selector.select({
      text: `Set of ${t.view.blocks.length}`,
      quantity: t.view.blocks.length,
      noToggle: !0
    }), this.product && !compareObjects(e.view.blocks, t.view.blocks)) {
      const { blocks: s } = t.view;
      !this.projectId && !productParams.get("project-id") && !this.orderCreating && s.some((i) => i.childBlocks.some((r) => r.imageUrl)) && (this.orderCreating = !0, this.createOrder().then((i) => {
        this.projectId = i.projectId, this.setOrderPath(), this.getOrderInfo(this.projectId).then((r) => {
          this.orderInfo = r, this.orderCreating = !1;
        });
      }));
      const a = s.find((o) => o.selected), n = s.find((o) => o.activeChild);
      if (s.every((o) => !o.selected && !o.activeChild))
        this.setTools({
          remove: !0
        });
      else if (Studio.state.product && Studio.state.product.type.id === "photobook") {
        if (a)
          (a || n) && this.setTools({
            selected: a
          });
        else if (n) {
          const o = n.childBlocks.find((i) => i.selected);
          if (o) {
            const i = o.tools.filter((r) => {
              switch (r) {
                case "rotate":
                  return this.product.settings.hasRotate;
                case "crop":
                  return this.product.settings.hasCrop;
                case "text":
                  return this.product.settings.hasText;
                default:
                  return !0;
              }
            });
            this.setTools({
              toolsList: i,
              selected: o
            });
          }
        }
      } else
        Studio.state.product && s.some((o) => o.selected || o.activeChild) && this.setTools({
          all: !0,
          selected: a || n
        });
    }
    Studio.panel.tools.setImageSelected(t.view.blocks), this.studioView.setState(t.view);
  }
  setTools({ toolsList: e, selected: t, all: s = !1, remove: a = !1 }) {
    const { tools: n } = JSON.parse(Studio.panel.getAttribute("state")), o = { ...n };
    if (a) {
      for (const r in o)
        o[r] = {
          ...o[r],
          show: !1
        };
      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute("state")),
          tools: o
        }
      }, "product builder - set tools(remove all)");
      return;
    }
    if (s) {
      const { settings: r } = this.product, u = t ? t.childBlocks.find((l) => l.type === "editable-picture") : null, d = t ? t.childBlocks.find((l) => l.type === "text") : null;
      for (const l in o)
        switch (l) {
          case "backgroundColor":
            o[l] = {
              ...o[l],
              show: r.hasBackground,
              value: t.settings.backgroundColor ? t.settings.backgroundColor : BackgroundColorTool.defaultValue
            };
            break;
          case "layout":
            o[l] = {
              ...o[l],
              show: r.hasLayout,
              value: t.settings.layout ? t.settings.layout : LayoutTool.defaultValue
            };
            break;
          case "rotate":
            o[l] = {
              ...o[l],
              show: r.hasRotate,
              value: u && u.settings.rotate ? u.settings.rotate : RotateTool.defaultValue
            };
            break;
          case "crop":
            o[l] = {
              ...o[l],
              show: r.hasCrop,
              value: u && u.settings.crop ? u.settings.crop : CropTool.defaultValue
            };
            break;
          case "frame":
            o[l] = {
              ...o[l],
              show: r.hasFrame,
              value: t.settings.frame ? t.settings.frame : FrameTool.defaultValue
            };
            break;
          case "text":
            o[l] = {
              ...o[l],
              show: r.hasText,
              value: d ? d.settings : TextTool.defaultValue
            };
            break;
        }
      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute("state")),
          tools: o
        }
      }, "product builder - set tools(all accepted)");
      return;
    }
    if (!t)
      return;
    const { settings: i } = t;
    if (!e) {
      const { settings: r } = this.product, u = this.childTools = ["rotate", "filter", "crop", "text"], d = (l) => i[l] ? i[l] : Studio.state.panel.tools[l].value;
      for (const l in o) {
        if (u.includes(l)) {
          o[l] = {
            ...o[l],
            show: !1
          };
          continue;
        }
        switch (l) {
          case "layout":
            o[l] = {
              ...o[l],
              show: r.hasLayout,
              value: i[l] ? i[l] : LayoutTool.defaultValue
            };
            break;
          case "backgroundColor":
            o[l] = {
              ...o[l],
              show: r.hasBackground,
              value: d(l)
            };
            break;
          case "frame":
            o[l] = {
              ...o[l],
              show: r.hasFrame,
              value: d(l)
            };
        }
      }
      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute("state")),
          tools: o
        }
      }, "product builder - set tools");
      return;
    }
    for (const r in o)
      o[r] = {
        ...o[r],
        show: e.includes(r),
        value: e.includes(r) ? i[r] : o[r].value
      };
    Studio.utils.change({
      panel: {
        ...JSON.parse(Studio.panel.getAttribute("state")),
        tools: o
      }
    }, "product builder - set tools for block");
  }
  downloadFacebookAPI() {
    return new Promise(async (e, t) => {
      const s = document.createElement("script"), a = await fetch(baseURL + "/api/social/credentials").then((n) => n.json());
      if (this.credentials = a, !a || !a.facebook) {
        e();
        return;
      }
      s.onload = () => {
        FB.init({
          appId: a.facebook.id,
          autoLogAppEvent: !0,
          version: "v17.0"
        }), e();
      }, s.onerror = () => t(), s.src = "https://connect.facebook.net/en_US/sdk.js", this.appendChild(s);
    });
  }
  redirectFromInst(e) {
    const t = JSON.parse(e);
    localStorage.removeItem("instToRedirect");
    const s = new URLSearchParams(location.search), a = s.get("access_token"), n = s.get("user_id");
    localStorage.setItem("oauthInstagram", JSON.stringify({
      access_token: a,
      user_id: n
    }));
    const o = new URL(location.pathname, location.origin);
    for (const i in t)
      t[i] && o.searchParams.append(i, t[i]);
    o.searchParams.append("from_redirect", "instagram"), location.replace(o.href);
  }
  setState(e) {
    const t = {
      ...JSON.parse(this.getAttribute("state")),
      ...e
    };
    this.setAttribute("state", JSON.stringify(t));
  }
  async init() {
    this.setState(O), this.addEventListener("studio:change", (t) => {
      const { state: s, callback: a } = t.detail;
      a && this.asyncExpectants.push(a);
      const n = JSON.parse(this.getAttribute("state"));
      s && this.setState({
        ...n,
        ...s
      });
    });
    const e = await this.getCustomer();
    if (e || (this.anonimCustomerId = Cookies.get("product-builder-anonim-id")), this.setState({
      ...JSON.parse(this.getAttribute("state")),
      productId: productParams.get("id") || null
    }), Promise.all([this.downloadFacebookAPI()]).then((t) => {
      customElements.define("image-chooser", ImageChooser);
    }), this.customer = e, this.uploaded = await this.getUploadedList(), this.uploaded && this.uploaded.length > 0 && this.panel.tools.uploadedImages(this.uploaded), productParams.get("project-id")) {
      !this.customer && !this.anonimCustomerId && this.defaultBuilderPath(), this.projectId = productParams.get("project-id");
      const t = await this.getOrderState(this.projectId);
      if (!t)
        return;
      t && !t.error ? Studio.utils.change(t) : (this.projectId = await this.createOrder(), this.orderInfo = await this.getOrderInfo(this.projectId), this.setOrderPath());
    }
    await this.getCart(), this.dispatchEvent(new CustomEvent("studio:inited")), this.inited = !0;
  }
  async getProduct(e) {
    let t = productParams.get("id");
    return e && (t = e, this.productId = t), fetch(`product-builder/product?id=${t}`).then((s) => s.json());
  }
  async createOrder() {
    const e = Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId;
    if (e)
      return fetch(`product-builder/orders/create?id=${e}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Studio.state)
      }).then((t) => t.json()).then((t) => t);
  }
  async getCart() {
    const e = await fetch(location.origin + "/cart.js").then((t) => t.json());
    return this.cart = e, e;
  }
  setOrderPath() {
    const e = location.origin + location.pathname + `?project-id=${this.projectId}`, t = document.title, s = { additionalInformation: "Product builder with order history" };
    window.history.replaceState(s, t, e), productParams = new URLSearchParams(location.search);
  }
  defaultBuilderPath() {
    const e = location.origin + location.pathname, t = document.title, s = { additionalInformation: "Product builder with order history" };
    this.projectId = null, window.history.pushState(s, t, e), productParams = new URLSearchParams(location.search);
  }
  async getOrderInfo(e) {
    const t = Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId;
    return await fetch(`product-builder/orders/info/${e}?id=${t}`).then((s) => s.json()).then((s) => {
      if (!s.error)
        return s;
      Studio.errorToast.error({
        text: s.error,
        type: "User's access"
      });
    });
  }
  async getOrderState(e) {
    const t = Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId;
    if (!(!t && e) && !(!t || !e) && (this.orderInfo = await this.getOrderInfo(e), !!this.orderInfo))
      return fetch(`product-builder/orders/state/${e}?id=${t}`).then((s) => s.json()).then((s) => (s.error && Studio.errorToast.error({
        text: s.error,
        type: "Directory mismatch"
      }), s));
  }
  async updateOrder(e) {
    const t = Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId;
    if (!e || !t)
      return;
    const s = {
      ...Studio.state,
      imagesToDownload: null,
      view: {
        ...Studio.state.view,
        imagesToDownload: null
      }
    };
    return fetch(`product-builder/orders/update/${e}?id=${t}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(s)
    }).then((a) => a.json());
  }
  getCustomer() {
    const e = window.customerId;
    return e ? fetch(`product-builder/customer?id=${e}`).then((t) => t.json()).then((t) => t.error ? null : t) : null;
  }
  async getUploadedList() {
    return !this.anonimCustomerId && !this.customer ? [] : fetch(`product-builder/uploads/list${this.customer ? `?customerId=${this.customer.shopify_id}` : `?anonimId=${this.anonimCustomerId}`}`).then((e) => e.json()).then((e) => Array.isArray(e) ? e.map((t) => ({
      original: cdnPublicURL + "/" + t,
      thumbnail: t + `?width=${devicePixelRatio * 125}&thumbnail=true`
    })) : []);
  }
  checkImages() {
    this.panel.getImages().forEach((e) => {
      this.panel.tools.isSelectedImage(e, this.studioView.getImages().includes(e));
    });
  }
};
C(k, "selectors", {
  panel: "[customization-panel]",
  studioView: "[studio-view]",
  errorToast: "error-toast",
  relatedProducts: "related-products"
});
let I = k;
customElements.define("product-builder", I);
window.oauthInstagram = JSON.parse(localStorage.getItem("oauthInstagram"));
(function() {
  const e = document.referrer !== "" && new URL(document.referrer).pathname.endsWith("/apps/product-builder") ? new URL(document.referrer) : new URL(location.origin + localization.fallbackURL), t = document.querySelector("[data-back-button]");
  if (t)
    return t.addEventListener("click", () => {
      location.replace(e.href);
    }), t;
})();
(function() {
  const e = document.querySelector("[data-checkout-button]");
  if (e.disable = () => {
    e.hasAttribute("disabled") || e.toggleAttribute("disabled");
  }, e.enable = () => {
    e.removeAttribute("disabled");
  }, !!e)
    return e.addEventListener("click", async () => {
      const t = productParams.get("project-id");
      if (e.disable(), !Studio.state.product) {
        e.enable();
        return;
      }
      const {
        isEnough: s,
        current: a,
        required: n
      } = Studio.panel.productInfo.checkDoneProduct(), o = Studio.product.quantity.minimum, i = n - a;
      if (Studio.product.quantity.type === "multiply" && a < o) {
        Studio.errorToast.error({
          text: `Not enough products quantity. Add ${i} more ${i === 1 ? "block" : "blocks"} to add project to the cart`
        }), e.enable();
        return;
      } else if (a < o) {
        Studio.errorToast.error({
          text: "To checkout project - each picture must have an image"
        }), e.enable();
        return;
      }
      const r = Studio.state.view.blocks.filter((d) => d.childBlocks.filter((p) => p.type === "editable-picture").every((p) => p.imageUrl));
      Studio.utils.change({ view: { blocks: r } }, "view - clear empty blocks");
      const u = await Studio.relatedProducts.getRelatedProducts();
      if (u.rejected) {
        e.enable();
        return;
      }
      if (t) {
        const d = await fetch(location.origin + `/products/${Studio.product.handle}.js`).then((c) => c.ok ? c.json() : null), { product: l } = Studio.state;
        let p = d.variants[0], v;
        if (l.quantity.type)
          switch (l.quantity.type) {
            case "multiply":
            case "set-of":
              v = Studio.studioView.getBlocksCount(Studio.state.view.blocks);
              break;
            case "single":
              v = 1;
              break;
            default:
              v = 1;
          }
        let b = {};
        if (Studio.orderInfo && Studio.orderInfo.status === "draft") {
          const { projectId: c, quantity: g, product: f } = Studio.orderInfo, h = {
            project_id: c
          };
          Studio.anonimCustomerId && !Studio.customer && (h.anonim_id = Studio.anonimCustomerId), b = await fetch(location.origin + "/cart/add.js", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              items: [
                {
                  id: p.id,
                  quantity: v,
                  properties: h
                },
                ...u
              ]
            })
          }).then((S) => S.json());
        }
        if (b.status)
          Studio.errorToast.error({
            text: b.description,
            type: b.message
          });
        else {
          fetch(`product-builder/orders/checkout/${t}?id=${Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId}`).then((c) => {
            if (c.ok) {
              const g = document.createElement("a");
              g.href = location.origin + "/cart", g.click();
            }
          });
          return;
        }
      } else
        Studio.errorToast.error({
          text: "No project id provided"
        });
      e.enable();
    }), e;
})();
new DOMParser();
window.ImageLimits = {
  size: 25 * 1024 * 1024,
  resolution: {
    width: 200,
    height: 200
  },
  types: ["image/jpeg", "image/png", "image/webp"]
};
