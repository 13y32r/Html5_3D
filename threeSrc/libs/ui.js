class UIElement {
  constructor(dom) {
    this.dom = dom;
    this.children = {};
  }

  add() {
    for (let i = 0; i < arguments.length; i++) {
      const argument = arguments[i];

      if (argument instanceof UIElement) {
        this.dom.appendChild(argument.dom);
        if (argument.dom.name) {
          this.children[argument.dom.name] = argument.dom;
        }
      } else {
        console.error(
          "UIElement:",
          argument,
          "is not an instance of UIElement."
        );
      }
    }

    return this;
  }

  remove() {
    for (let i = 0; i < arguments.length; i++) {
      const argument = arguments[i];

      if (argument instanceof UIElement) {
        this.dom.removeChild(argument.dom);
        if (argument.dom.name) {
          delete this.children[argument.dom.name];
        }
      } else {
        console.error(
          "UIElement:",
          argument,
          "is not an instance of UIElement."
        );
      }
    }

    return this;
  }

  clear() {
    while (this.dom.children.length) {
      this.dom.removeChild(this.dom.lastChild);
    }
  }

  setId(id) {
    this.dom.id = id;

    return this;
  }

  getId() {
    return this.dom.id;
  }

  setName(name) {
    this.dom.setAttribute("name", name);
  }

  getName() {
    return this.dom.name;
  }

  setAttribute(attributename, attributevalue) {
    this.dom.setAttribute(attributename, attributevalue);
  }

  setClass(name) {
    this.dom.className = name;

    return this;
  }

  addClass(name) {
    this.dom.classList.add(name);

    return this;
  }

  removeClass(name) {
    this.dom.classList.remove(name);

    return this;
  }

  setStyle(style, array) {
    for (let i = 0; i < array.length; i++) {
      this.dom.style[style] = array[i];
    }

    return this;
  }

  setDisabled(value) {
    this.dom.disabled = value;

    return this;
  }

  setTextContent(value) {
    this.dom.textContent = value;

    return this;
  }

  setInnerHTML(value) {
    this.dom.innerHTML = value;
  }

  getIndexOfChild(element) {
    return Array.prototype.indexOf.call(this.dom.children, element.dom);
  }
}

// properties

const properties = [
  "position",
  "left",
  "top",
  "right",
  "bottom",
  "width",
  "height",
  "display",
  "visibility",
  "verticalAlign",
  "overflow",
  "color",
  "background",
  "backgroundRepeat",
  "backgroundColor",
  "backgroundImage",
  "opacity",
  "border",
  "borderLeft",
  "borderTop",
  "borderRight",
  "borderBottom",
  "borderColor",
  "borderRadius",
  "margin",
  "marginLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "padding",
  "paddingLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "fontSize",
  "fontWeight",
  "fontFamily",
  "textAlign",
  "textDecoration",
  "textTransform",
  "cursor",
  "zIndex",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "lineHeight",
  "outline",
  "userSelect",
  "touchAction",
];

properties.forEach(function (property) {
  const method =
    "set" +
    property.substring(0, 1).toUpperCase() +
    property.substring(1, property.length);

  UIElement.prototype[method] = function () {
    this.setStyle(property, arguments);

    return this;
  };
});

// events

const events = [
  "KeyUp",
  "KeyDown",
  "MouseOver",
  "MouseOut",
  "Click",
  "DblClick",
  "Change",
  "Input",
  "PointerDown",
  "PointerUp",
  "PointerMove",
  "PointerOver",
  "PointerOut",
];

events.forEach(function (event) {
  const method = "on" + event;

  UIElement.prototype[method] = function (callback) {
    this.dom.addEventListener(event.toLowerCase(), callback.bind(this));

    return this;
  };
});

class UISpan extends UIElement {
  constructor() {
    super(document.createElement("span"));
  }
}

class UIDiv extends UIElement {
  constructor() {
    super(document.createElement("div"));
  }
}

class UIRow extends UIDiv {
  constructor() {
    super();

    this.dom.className = "Row";
  }
}

class UIPanel extends UIDiv {
  constructor() {
    super();

    this.dom.className = "Panel";
  }
}

class UIText extends UISpan {
  constructor(text) {
    super();

    this.dom.className = "Text";
    this.dom.style.cursor = "default";
    this.dom.style.display = "inline-block";

    this.setValue(text);
  }

  getValue() {
    return this.dom.textContent;
  }

  setValue(value) {
    if (value !== undefined) {
      this.dom.textContent = value;
    }

    return this;
  }
}

class UIInput extends UIElement {
  constructor(text) {
    super(document.createElement("input"));

    this.dom.className = "Input";
    this.dom.style.padding = "2px";
    this.dom.style.border = "1px solid transparent";
    this.dom.style.color = "#f5f5f5";
    this.dom.style.backgroundColor = "#282828";

    this.dom.setAttribute("autocomplete", "off");

    this.dom.addEventListener("keydown", function (event) {
      event.stopPropagation();
    });

    let tempEditorState = null;

    this.dom.addEventListener("focus", function (event) {
      if (tempEditorState == null) {
        tempEditorState = window["editorOperate"].state;
        window["editorOperate"].changeEditorState(EditorState.INPUT);
        window["editorOperate"].stopKeyEvent();
      }
    });

    this.dom.addEventListener("blur", function (event) {
      if (tempEditorState != null) {
        window["editorOperate"].changeEditorState(tempEditorState);
        window["editorOperate"].reKeyEvent();
        tempEditorState = null;
      }
    });

    this.setValue(text);
  }

  getValue() {
    return this.dom.value;
  }

  setValue(value) {
    this.dom.value = value;

    return this;
  }
}

class UITextArea extends UIElement {
  constructor() {
    super(document.createElement("textarea"));

    this.dom.className = "TextArea";
    this.dom.style.padding = "2px";
    this.dom.spellcheck = false;

    this.dom.setAttribute("autocomplete", "off");

    this.dom.addEventListener("keydown", function (event) {
      event.stopPropagation();

      if (event.keyCode === 9) {
        event.preventDefault();

        const cursor = this.selectionStart;

        this.value =
          this.value.substring(0, cursor) + "\t" + this.value.substring(cursor);
        this.selectionStart = cursor + 1;
        this.selectionEnd = this.selectionStart;
      }
    });
  }

  getValue() {
    return this.dom.value;
  }

  setValue(value) {
    this.dom.value = value;

    return this;
  }
}

class UISelect extends UIElement {
  constructor() {
    super(document.createElement("select"));

    this.dom.className = "Select";

    this.dom.setAttribute("autocomplete", "off");
  }

  setMultiple(boolean) {
    this.dom.multiple = boolean;

    return this;
  }

  setOptions(options) {
    const selected = this.dom.value;

    while (this.dom.children.length > 0) {
      this.dom.removeChild(this.dom.firstChild);
    }

    for (const key in options) {
      const option = document.createElement("option");
      option.value = key;
      option.innerHTML = options[key];
      this.dom.appendChild(option);
    }

    this.dom.value = selected;

    return this;
  }

  getValue() {
    return this.dom.value;
  }

  setValue(value) {
    value = String(value);

    if (this.dom.value !== value) {
      this.dom.value = value;
    }

    return this;
  }
}

class UICheckbox extends UIElement {
  constructor(boolean) {
    super(document.createElement("input"));

    this.dom.className = "Checkbox";
    this.dom.type = "checkbox";

    this.setValue(boolean);
  }

  getValue() {
    return this.dom.checked;
  }

  setValue(value) {
    if (value !== undefined) {
      this.dom.checked = value;
    }

    return this;
  }
}

class UIColor extends UIElement {
  constructor() {
    super(document.createElement("input"));

    this.dom.className = "Color";
    this.dom.style.width = "32px";
    this.dom.style.height = "16px";
    this.dom.style.border = "0px";
    this.dom.style.padding = "2px";
    this.dom.style.backgroundColor = "transparent";

    this.dom.setAttribute("autocomplete", "off");

    try {
      this.dom.type = "color";
      this.dom.value = "#ffffff";
    } catch (exception) {}
  }

  getValue() {
    return this.dom.value;
  }

  getHexValue() {
    return parseInt(this.dom.value.substr(1), 16);
  }

  setValue(value) {
    this.dom.value = value;

    return this;
  }

  setHexValue(hex) {
    this.dom.value = "#" + ("000000" + hex.toString(16)).slice(-6);

    return this;
  }
}

class UINumber extends UIElement {
  constructor(number) {
    super(document.createElement("input"));

    this.dom.style.cursor = "ns-resize";
    this.dom.className = "Number";
    this.dom.value = "0.00";

    this.dom.setAttribute("autocomplete", "off");

    this.value = 0;

    this.min = -Infinity;
    this.max = Infinity;

    this.precision = 2;
    this.step = 1;
    this.unit = "";
    this.nudge = 0.01;

    this.setValue(number);

    const scope = this;

    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
    });

    let distance = 0;
    let onPointerDownValue = 0;

    const pointer = { x: 0, y: 0 };
    const prevPointer = { x: 0, y: 0 };

    function onPointerDown(event) {
      event.preventDefault();

      distance = 0;

      onPointerDownValue = scope.value;

      prevPointer.x = event.clientX;
      prevPointer.y = event.clientY;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      const currentValue = scope.value;

      pointer.x = event.clientX;
      pointer.y = event.clientY;

      distance += pointer.x - prevPointer.x - (pointer.y - prevPointer.y);

      let value =
        onPointerDownValue +
        (distance / (event.shiftKey ? 5 : 50)) * scope.step;
      value = Math.min(scope.max, Math.max(scope.min, value));

      if (currentValue !== value) {
        scope.setValue(value);
        scope.dom.dispatchEvent(changeEvent);
      }

      prevPointer.x = event.clientX;
      prevPointer.y = event.clientY;
    }

    function onPointerUp() {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      if (Math.abs(distance) < 2) {
        scope.dom.focus();
        scope.dom.select();
      }
    }

    // function onTouchStart( event ) {

    // 	if ( event.touches.length === 1 ) {

    // 		distance = 0;

    // 		onPointerDownValue = scope.value;

    // 		prevPointer.x = event.touches[ 0 ].pageX;
    // 		prevPointer.y = event.touches[ 0 ].pageY;

    // 		document.addEventListener( 'touchmove', onTouchMove );
    // 		document.addEventListener( 'touchend', onTouchEnd );

    // 	}

    // }

    // function onTouchMove( event ) {

    // 	const currentValue = scope.value;

    // 	pointer.x = event.touches[ 0 ].pageX;
    // 	pointer.y = event.touches[ 0 ].pageY;

    // 	distance += ( pointer.x - prevPointer.x ) - ( pointer.y - prevPointer.y );

    // 	let value = onPointerDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
    // 	value = Math.min( scope.max, Math.max( scope.min, value ) );

    // 	if ( currentValue !== value ) {

    // 		scope.setValue( value );
    // 		scope.dom.dispatchEvent( changeEvent );

    // 	}

    // 	prevPointer.x = event.touches[ 0 ].pageX;
    // 	prevPointer.y = event.touches[ 0 ].pageY;

    // }

    // function onTouchEnd( event ) {

    // 	if ( event.touches.length === 0 ) {

    // 		document.removeEventListener( 'touchmove', onTouchMove );
    // 		document.removeEventListener( 'touchend', onTouchEnd );

    // 	}

    // }

    function onChange() {
      scope.setValue(scope.dom.value);
    }

    function onFocus() {
      scope.dom.style.backgroundColor = "";
      scope.dom.style.cursor = "";
    }

    function onBlur() {
      scope.dom.style.backgroundColor = "transparent";
      scope.dom.style.cursor = "ns-resize";
    }

    function onKeyDown(event) {
      event.stopPropagation();

      switch (event.keyCode) {
        case 13: // enter
          scope.dom.blur();
          break;

        case 38: // up
          event.preventDefault();
          scope.setValue(scope.getValue() + scope.nudge);
          scope.dom.dispatchEvent(changeEvent);
          break;

        case 40: // down
          event.preventDefault();
          scope.setValue(scope.getValue() - scope.nudge);
          scope.dom.dispatchEvent(changeEvent);
          break;
      }
    }

    onBlur();

    this.dom.addEventListener("keydown", onKeyDown);
    this.dom.addEventListener("pointerdown", onPointerDown);
    // this.dom.addEventListener( 'touchstart', onTouchStart );
    this.dom.addEventListener("change", onChange);
    this.dom.addEventListener("focus", onFocus);
    this.dom.addEventListener("blur", onBlur);
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    if (value !== undefined) {
      value = parseFloat(value);

      if (value < this.min) value = this.min;
      if (value > this.max) value = this.max;

      this.value = value;
      this.dom.value = value.toFixed(this.precision);

      if (this.unit !== "") this.dom.value += " " + this.unit;
    }

    return this;
  }

  setPrecision(precision) {
    this.precision = precision;

    return this;
  }

  setStep(step) {
    this.step = step;

    return this;
  }

  setNudge(nudge) {
    this.nudge = nudge;

    return this;
  }

  setRange(min, max) {
    this.min = min;
    this.max = max;

    return this;
  }

  setUnit(unit) {
    this.unit = unit;

    return this;
  }
}

class UIInteger extends UIElement {
  constructor(number) {
    super(document.createElement("input"));

    this.dom.style.cursor = "ns-resize";
    this.dom.className = "Number";
    this.dom.value = "0";

    this.dom.setAttribute("autocomplete", "off");

    this.value = 0;

    this.min = -Infinity;
    this.max = Infinity;

    this.step = 1;
    this.nudge = 1;

    this.setValue(number);

    const scope = this;

    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
    });

    let distance = 0;
    let onPointerDownValue = 0;

    const pointer = { x: 0, y: 0 };
    const prevPointer = { x: 0, y: 0 };

    function onPointerDown(event) {
      event.preventDefault();

      distance = 0;

      onPointerDownValue = scope.value;

      prevPointer.x = event.clientX;
      prevPointer.y = event.clientY;

      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    function onPointerMove(event) {
      const currentValue = scope.value;

      pointer.x = event.clientX;
      pointer.y = event.clientY;

      distance += pointer.x - prevPointer.x - (pointer.y - prevPointer.y);

      let value =
        onPointerDownValue +
        (distance / (event.shiftKey ? 5 : 50)) * scope.step;
      value = Math.min(scope.max, Math.max(scope.min, value)) | 0;

      if (currentValue !== value) {
        scope.setValue(value);
        scope.dom.dispatchEvent(changeEvent);
      }

      prevPointer.x = event.clientX;
      prevPointer.y = event.clientY;
    }

    function onPointerUp() {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      if (Math.abs(distance) < 2) {
        scope.dom.focus();
        scope.dom.select();
      }
    }

    function onChange() {
      scope.setValue(scope.dom.value);
    }

    function onFocus() {
      scope.dom.style.backgroundColor = "";
      scope.dom.style.cursor = "";
    }

    function onBlur() {
      scope.dom.style.backgroundColor = "transparent";
      scope.dom.style.cursor = "ns-resize";
    }

    function onKeyDown(event) {
      event.stopPropagation();

      switch (event.keyCode) {
        case 13: // enter
          scope.dom.blur();
          break;

        case 38: // up
          event.preventDefault();
          scope.setValue(scope.getValue() + scope.nudge);
          scope.dom.dispatchEvent(changeEvent);
          break;

        case 40: // down
          event.preventDefault();
          scope.setValue(scope.getValue() - scope.nudge);
          scope.dom.dispatchEvent(changeEvent);
          break;
      }
    }

    onBlur();

    this.dom.addEventListener("keydown", onKeyDown);
    this.dom.addEventListener("pointerdown", onPointerDown);
    this.dom.addEventListener("change", onChange);
    this.dom.addEventListener("focus", onFocus);
    this.dom.addEventListener("blur", onBlur);
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    if (value !== undefined) {
      value = parseInt(value);

      this.value = value;
      this.dom.value = value;
    }

    return this;
  }

  setStep(step) {
    this.step = parseInt(step);

    return this;
  }

  setNudge(nudge) {
    this.nudge = nudge;

    return this;
  }

  setRange(min, max) {
    this.min = min;
    this.max = max;

    return this;
  }
}

class UIBreak extends UIElement {
  constructor() {
    super(document.createElement("br"));

    this.dom.className = "Break";
  }
}

class UIHorizontalSplitLine extends UIElement {
  constructor() {
    super(document.createElement("div"));

    this.dom.className = "HorizontalSplitLine";
  }
}

class UIVerticalSplitLine extends UIElement {
  constructor() {
    super(document.createElement("div"));

    this.dom.className = "VerticalSplitLine";
  }
}

class UIVerticalPromptLine extends UIElement {
  constructor() {
    super(document.createElement("div"));

    this.dom.className = "VerticalPromptLine";
    this.setAttribute("name", "VerticalPromptLine");
  }
}

class UIButton extends UIElement {
  constructor(value) {
    super(document.createElement("button"));

    this.dom.className = "UIButton";
    this.dom.textContent = value;
  }
}

class UIProgress extends UIElement {
  constructor(value) {
    super(document.createElement("progress"));

    this.dom.value = value;
  }

  setValue(value) {
    this.dom.value = value;
  }
}

class UITabbedPanel extends UIDiv {
  constructor() {
    super();

    this.dom.className = "TabbedPanel";

    this.tabs = [];
    this.panels = [];

    this.tabsDiv = new UIDiv();
    this.tabsDiv.setClass("Tabs");

    this.panelsDiv = new UIDiv();
    this.panelsDiv.setClass("Panels");

    this.add(this.tabsDiv);
    this.add(this.panelsDiv);

    this.selected = "";
  }

  select(id) {
    let tab;
    let panel;
    const scope = this;

    // Deselect current selection
    if (this.selected && this.selected.length) {
      tab = this.tabs.find(function (item) {
        return item.dom.id === scope.selected;
      });
      panel = this.panels.find(function (item) {
        return item.dom.id === scope.selected;
      });

      if (tab) {
        tab.removeClass("selected");
      }

      if (panel) {
        panel.setDisplay("none");
      }
    }

    tab = this.tabs.find(function (item) {
      return item.dom.id === id;
    });
    panel = this.panels.find(function (item) {
      return item.dom.id === id;
    });

    if (tab) {
      tab.addClass("selected");
    }

    if (panel) {
      panel.setDisplay("");
    }

    this.selected = id;

    return this;
  }

  addTab(id, label, items) {
    const tab = new UITab(label, this);
    tab.setId(id);
    this.tabs.push(tab);
    this.tabsDiv.add(tab);

    const panel = new UIDiv();
    panel.setId(id);
    panel.add(items);
    panel.setDisplay("none");
    this.panels.push(panel);
    this.panelsDiv.add(panel);

    this.select(id);
  }
}

class UITab extends UIText {
  constructor(text, parent) {
    super(text);

    this.dom.className = "Tab";

    this.parent = parent;

    const scope = this;

    this.dom.addEventListener("click", function () {
      scope.parent.select(scope.dom.id);
    });
  }
}

class UIListbox extends UIDiv {
  constructor() {
    super();

    this.dom.className = "Listbox";
    this.dom.tabIndex = 0;

    this.items = [];
    this.listitems = [];
    this.selectedIndex = 0;
    this.selectedValue = null;
  }

  setItems(items) {
    if (Array.isArray(items)) {
      this.items = items;
    }

    this.render();
  }

  render() {
    while (this.listitems.length) {
      const item = this.listitems[0];

      item.dom.remove();

      this.listitems.splice(0, 1);
    }

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      const listitem = new UIListbox.ListboxItem(this);
      listitem.setId(item.id || `Listbox-${i}`);
      listitem.setTextContent(item.name || item.type);
      this.add(listitem);
    }
  }

  add() {
    const items = Array.from(arguments);

    this.listitems = this.listitems.concat(items);

    UIElement.prototype.add.apply(this, items);
  }

  selectIndex(index) {
    if (index >= 0 && index < this.items.length) {
      this.setValue(this.listitems[index].getId());
    }

    this.selectedIndex = index;
  }

  getValue() {
    return this.selectedValue;
  }

  setValue(value) {
    for (let i = 0; i < this.listitems.length; i++) {
      const element = this.listitems[i];

      if (element.getId() === value) {
        element.addClass("active");
      } else {
        element.removeClass("active");
      }
    }

    this.selectedValue = value;

    const changeEvent = new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
    });
    this.dom.dispatchEvent(changeEvent);
  }
}

class ListboxItem extends UIDiv {
  constructor(parent) {
    super();

    this.dom.className = "ListboxItem";

    this.parent = parent;

    const scope = this;

    function onClick() {
      if (scope.parent) {
        scope.parent.setValue(scope.getId());
      }
    }

    this.dom.addEventListener("click", onClick);
  }
}

function documentBodyAdd(uiEle) {
  document.body.appendChild(uiEle.dom);
}

export {
  UIElement,
  UISpan,
  UIDiv,
  UIRow,
  UIPanel,
  UIText,
  UIInput,
  UITextArea,
  UISelect,
  UICheckbox,
  UIColor,
  UINumber,
  UIInteger,
  UIBreak,
  UIButton,
  UIProgress,
  UITabbedPanel,
  UIListbox,
  ListboxItem,
  UIHorizontalSplitLine,
  UIVerticalSplitLine,
  UIVerticalPromptLine,
  documentBodyAdd,
};
