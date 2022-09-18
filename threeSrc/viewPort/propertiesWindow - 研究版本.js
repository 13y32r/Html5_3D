class PropertiesWindow {
  constructor() {
    this.linkCSS();
    this.dragElement = this.dragElement.bind(this);
    this.addCustomNumberInput = this.addCustomNumberInput.bind(this);
    this.inputPreName = this.inputPreName.bind(this);
    this.addCustomStringInput = this.addCustomStringInput.bind(this);
    this.addAttrRow = this.addAttrRow.bind(this);
    this.addCustomCheckBox = this.addCustomCheckBox.bind(this);

    let initX = document.body.clientWidth - 285;
    initX = Math.floor(Math.random() * initX);
    let initY = Math.floor(Math.random() * 100);

    let mainBody = document.createElement("div");
    mainBody.className = "propWindow_main";
    mainBody.setAttribute("style", "top:" + initY + "px;left:" + initX + "px;");

    let title = document.createElement("div");
    title.className = "propWindow_title";
    title.innerText = "检查窗";
    title.style.userSelect = "none";
    title.style.touchAction = "none";
    mainBody.appendChild(title);
    this.dragElement(title, mainBody);

    let options = document.createElement("div");
    options.className = "propWindow_options";
    mainBody.appendChild(options);

    let optionBtn1 = document.createElement("div");
    optionBtn1.className = "propWindow_options_selButton";
    optionBtn1.innerHTML = "对象属性";
    options.appendChild(optionBtn1);

    let optionBtn2 = document.createElement("div");
    optionBtn2.className = "propWindow_options_unSelButton";
    optionBtn2.innerHTML = "对象材质";
    options.appendChild(optionBtn2);

    let optionBtns = new Array();
    optionBtns.push(optionBtn1);
    optionBtns.push(optionBtn2);
    for (let i = 0; i < optionBtns.length; i++) {
      optionBtns[i].addEventListener("pointerdown", function (event) {
        optionBtns[i].setPointerCapture(event.pointerId);
        for (let j = 0; j < optionBtns.length; j++) {
          if (j == i) {
            optionBtns[j].className = "propWindow_options_selButton";
          } else {
            optionBtns[j].className = "propWindow_options_unSelButton";
          }
        }
      });
    }

    let arrContent = document.createElement("div");
    arrContent.className = "propWindow_content";
    mainBody.appendChild(arrContent);

    let name = this.addAttrRow(arrContent, "名称");
    this.addCustomStringInput(name, 176);

    let position = this.addAttrRow(arrContent, "位置");
    let xpPreName = this.inputPreName("X", position);
    this.addCustomNumberInput(position, 40, 0.01);
    let ypPreName = this.inputPreName("Y", position);
    this.addCustomNumberInput(position, 40, 0.01);
    let zpPreName = this.inputPreName("Z", position);
    this.addCustomNumberInput(position, 40, 0.01);

    let rotation = this.addAttrRow(arrContent, "旋转");
    let xrPreName = this.inputPreName("X", rotation);
    this.addCustomNumberInput(rotation, 40, 0.01);
    let yrPreName = this.inputPreName("Y", rotation);
    this.addCustomNumberInput(rotation, 40, 0.01);
    let zrPreName = this.inputPreName("Z", rotation);
    this.addCustomNumberInput(rotation, 40, 0.01);

    let scale = this.addAttrRow(arrContent, "缩放");
    let xsPreName = this.inputPreName("X", scale);
    this.addCustomNumberInput(scale, 40, 0.01);
    let ysPreName = this.inputPreName("Y", scale);
    this.addCustomNumberInput(scale, 40, 0.01);
    let zsPreName = this.inputPreName("Z", scale);
    this.addCustomNumberInput(scale, 40, 0.01);

    let visibility = this.addAttrRow(arrContent, "可见性");
    let vPreName = this.inputPreName("漫反射", visibility);
    this.addCustomCheckBox(visibility, true);
    let tPreName = this.inputPreName("条件反射", visibility);
    this.addCustomCheckBox(visibility, false);
    visibility.style.display = "none";

    let colorAttr = this.addAttrRow(arrContent, "颜色");
    this.addCustomColorInput(colorAttr);

    let textureAttr = this.addAttrRow(arrContent, "材质");
    this.addCustomTextureInput(textureAttr);

    this.propWindow = mainBody;
  }

  linkCSS() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "./threeSrc/viewPort/propertiesWindow.css";
    document.getElementsByTagName("head")[0].appendChild(link);
  }

  inputPreName(name, fatherNode) {
    let preName = document.createElement("div");
    preName.innerHTML = name;
    preName.className = "propWindow_arrComponent";
    fatherNode.appendChild(preName);

    return preName;
  }

  addAttrRow(fatherNode, attrName) {
    let rowObj = document.createElement("div");
    rowObj.className = "propWindow_cell";
    fatherNode.appendChild(rowObj);
    let rowObjName = document.createElement("div");
    rowObjName.innerHTML = attrName;
    rowObjName.className = "propWindow_arrName";
    rowObj.appendChild(rowObjName);

    rowObj.rowObjName = rowObjName;

    return rowObj;
  }

  addCustomStringInput(fatherNode, width) {
    let customInput = document.createElement("input");
    customInput.className = "propWindow_input";
    customInput.style.width = width + "px";
    customInput.type = "text";
    customInput.autocomplete = "off";
    customInput.onfocus = function () {
      window["editorOperate"].tempState = window["editorOperate"].state;
      window["editorOperate"].changeEditorState(EditorState.INPUT);
    };
    customInput.onblur = function () {
      window["editorOperate"].changeEditorState(
        window["editorOperate"].tempState
      );
    };
    customInput.addEventListener("keydown", function (event) {
      event.stopPropagation();
      if (event.key == "Enter") customInput.blur();
    });
    fatherNode.appendChild(customInput);
  }

  addCustomNumberInput(fatherNode, width, increment) {
    let that = this;

    let customInput = document.createElement("input");
    customInput.className = "propWindow_input";
    customInput.style.width = width + "px";
    customInput.style.backgroundColor = "transparent";
    customInput.type = "number";
    customInput.value = "0.00";
    customInput.autocomplete = "off";

    customInput.addEventListener("keydown", function (event) {
      event.stopPropagation();
      switch (event.key) {
        case "Enter": // enter
          customInput.blur();
          break;

        case "ArrowUp": // up
          event.preventDefault();
          setValue(getValue() + 0.01);
          // scope.dom.dispatchEvent( changeEvent );
          break;

        case "ArrowDown": // down
          event.preventDefault();
          setValue(getValue() - 0.01);
          // scope.dom.dispatchEvent( changeEvent );
          break;
      }
    });

    customInput.onfocus = function () {
      customInput.style.backgroundColor = "";
      customInput.style.cursor = "";

      window["editorOperate"].tempState = window["editorOperate"].state;
      window["editorOperate"].changeEditorState(EditorState.INPUT);
      window["editorOperate"].stopKeyEvent();
    };
    customInput.onblur = function () {
      customInput.style.backgroundColor = "transparent";
      customInput.style.cursor = "ns-resize";

      window["editorOperate"].changeEditorState(
        window["editorOperate"].tempState
      );
      window["editorOperate"].reKeyEvent();
    };
    fatherNode.appendChild(customInput);

    customInput.style.userSelect = "none";
    customInput.style.touchAction = "none";

    function getValue() {
      return parseFloat(customInput.value);
    }

    function setValue(num) {
      customInput.value = num.toFixed(2);
    }

    that.dragChangeValue(customInput, customInput, increment);
  }

  dragChangeValue(dObject, cObject, step) {
    dObject.addEventListener("pointerdown", startChange);

    let posX_1 = 0,
      posX_2 = 0,
      posY_1 = 0,
      posY_2 = 0;

    let numValue = 0;
    let distance = 0;

    function startChange(e) {
      dObject.setPointerCapture(e.pointerId);

      if (!e.defaultPrevented) e.preventDefault();

      posX_1 = e.clientX;
      posY_1 = e.clientY;

      distance = 0;

      numValue = parseFloat(cObject.value);

      document.body.addEventListener("pointerup", endChange);
      document.body.addEventListener("pointercancel", endChange);
      document.body.addEventListener("pointermove", changing, {
        passive: false,
      });
    }

    function changing(e) {
      if (!e.defaultPrevented) e.preventDefault();

      document.body.setPointerCapture(e.pointerId);

      posX_2 = e.clientX;
      posY_2 = e.clientY;

      distance += posX_2 - posX_1 - (posY_2 - posY_1);
      numValue = numValue + (distance / (e.shiftKey ? 5 : 50)) * step;

      posX_1 = e.clientX;
      posY_1 = e.clientY;

      cObject.value = numValue;
    }

    function endChange(e) {
      document.body.releasePointerCapture(e.pointerId);

      document.body.removeEventListener("pointerup", endChange);
      document.body.removeEventListener("pointercancel", endChange);
      document.body.removeEventListener("pointermove", changing);

      if (Math.abs(distance) < 2) {
        cObject.focus();
        cObject.select();
      }
    }
  }

  addCustomCheckBox(fatherNode, value) {
    let customInput = document.createElement("input");
    customInput.type = "checkbox";
    customInput.checked = value;
    fatherNode.appendChild(customInput);
  }

  addCustomColorInput(fatherNode) {
    let customInput = document.createElement("input");
    try {
      customInput.type = "color";
      customInput.value = "#ffffff";
    } catch (exception) {
      console.log(exception);
    }
    customInput.className = "propWindow_inputColor";
    customInput.style.width = "32px";
    customInput.style.height = "16px";
    customInput.style.border = "1px solid black";
    customInput.style.padding = "0px";
    customInput.style.backgroundColor = "transparent";

    customInput.setAttribute("autocomplete", "off");
    fatherNode.appendChild(customInput);
  }

  addCustomTextureInput(fatherNode) {
    const form = document.createElement("form");
    const input = document.createElement("input");

    let mapping = THREE.UVMapping;

    input.type = "file";
    input.addEventListener("change", function (event) {
      loadFile(event.target.files[0]);
    });
    form.appendChild(input);

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 16;
    canvas.style.cursor = "pointer";
    canvas.style.border = "1px solid #888";
    canvas.oncontextmenu = function () {
      return false;
    };
    canvas.addEventListener("pointerdown", function (event) {
      if (event.button == 0) {
        input.click();
      } else if (event.button == 2) {
        setValue(null);
      }
    });
    canvas.addEventListener("drop", function (event) {
      event.preventDefault();
      event.stopPropagation();
      loadFile(event.dataTransfer.files[0]);
    });
    fatherNode.appendChild(canvas);

    function loadFile(file) {
      const extension = file.name.split(".").pop().toLowerCase();
      const reader = new FileReader();

      if (extension === "hdr" || extension === "pic") {
        reader.addEventListener("load", function (event) {
          const loader = new RGBELoader();
          loader.load(event.target.result, function (hdrTexture) {
            hdrTexture.sourceFile = file.name;
            hdrTexture.isHDRTexture = true;

            setValue(hdrTexture);

            if (onChangeCallback) onChangeCallback(hdrTexture);
          });
        });

        reader.readAsDataURL(file);
      } else if (extension === "tga") {
        reader.addEventListener(
          "load",
          function (event) {
            const canvas = new TGALoader().parse(event.target.result);

            const texture = new THREE.CanvasTexture(canvas, mapping);
            texture.sourceFile = file.name;

            setValue(texture);

            if (onChangeCallback) onChangeCallback(texture);
          },
          false
        );

        reader.readAsArrayBuffer(file);
      } else if (file.type.match("image.*")) {
        reader.addEventListener(
          "load",
          function (event) {
            const image = document.createElement("img");
            image.addEventListener(
              "load",
              function () {
                const texture = new THREE.Texture(this, mapping);
                texture.sourceFile = file.name;
                texture.needsUpdate = true;

                setValue(texture);

                // if (onChangeCallback) onChangeCallback(texture);
              },
              false
            );

            image.src = event.target.result;
          },
          false
        );

        reader.readAsDataURL(file);
      }

      form.reset();
    }

    // this.texture = null;
    // this.onChangeCallback = null;

    // function getValue() {
    //   return this.texture;
    // }

    function setValue(texture) {
      const context = canvas.getContext("2d");

      // Seems like context can be null if the canvas is not visible
      if (context) {
        // Always clear the context before set new texture, because new texture may has transparency
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      if (texture !== null) {
        const image = texture.image;

        if (image !== undefined && image.width > 0) {
          canvas.title = texture.sourceFile;
          const scale = canvas.width / image.width;

          if (image.data === undefined) {
            context.drawImage(
              image,
              0,
              0,
              image.width * scale,
              image.height * scale
            );
          } else {
            const canvas2 = renderToCanvas(texture);
            context.drawImage(
              canvas2,
              0,
              0,
              image.width * scale,
              image.height * scale
            );
          }
        } else {
          canvas.title = texture.sourceFile + " (error)";
        }
      } else {
        canvas.title = "empty";
      }

      // this.texture = texture;
    }

    function setEncoding(encoding) {
      const texture = this.getValue();

      if (texture !== null) {
        texture.encoding = encoding;
      }

      return this;
    }

    function delTexture() {}

    function onChange(callback) {
      // this.onChangeCallback = callback;
      // return this;
    }
  }

  openWindow() {
    if (!document.body.contains(this.propWindow))
      document.body.appendChild(this.propWindow);
  }

  closeWindow() {
    if (document.body.contains(this.propWindow))
      document.body.removeChild(this.propWindow);
  }

  dragElement(target, moveObj) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    target.addEventListener("pointerdown", dragMouseDown);

    function dragMouseDown(e) {
      target.setPointerCapture(e.pointerId);

      if (!e.defaultPrevented) e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;

      document.body.addEventListener("pointerup", closeDragElement);
      document.body.addEventListener("pointercancel", closeDragElement);
      document.body.addEventListener("pointermove", elementDragProcessingFn, {
        passive: false,
      });
    }

    function elementDragProcessingFn(e) {
      if (!e.defaultPrevented) e.preventDefault();

      document.body.setPointerCapture(e.pointerId);

      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position:
      if (moveObj.offsetTop - pos2 < 2) {
        moveObj.style.top = 3 + "px";
      } else if (moveObj.offsetTop - pos2 > window.innerHeight - 20) {
        moveObj.style.top = window.innerHeight - 21 + "px";
      } else if (moveObj.offsetLeft - pos1 > window.innerWidth - 180) {
        moveObj.style.left = window.innerWidth - 181 + "px";
      } else if (moveObj.offsetLeft - pos1 < -21) {
        moveObj.style.left = -20 + "px";
      } else {
        moveObj.style.top = moveObj.offsetTop - pos2 + "px";
        moveObj.style.left = moveObj.offsetLeft - pos1 + "px";
      }
    }

    function closeDragElement(e) {
      document.body.releasePointerCapture(e.pointerId);

      document.body.removeEventListener("pointerup", closeDragElement);
      document.body.removeEventListener("pointercancel", closeDragElement);
      document.body.removeEventListener("pointermove", elementDragProcessingFn);
    }
  }
}

export { PropertiesWindow };
