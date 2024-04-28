class ReturnBoxSelectedDom {
  constructor(selectTypeArray, receptionDom, callFn) {
    let that = this;

    if (callFn) {
      callFn.bind(that);
      this.callFn = callFn;
    }

    const outlineColor = "rgba(80,130,185,0.8)";
    const fillColor = "rgba(80,130,185,0.2)";

    this.startX, this.startY;
    this.selectBox;
    this.selectTypeString;
    this.certainReceptionDom;

    this.selectedDomEvent;
    this.selectedDoms = [];

    this.selectTypeString = selectTypeArray.join(",");

    this.selectBox = document.createElement("div");
    this.selectBox.id = "selectBox";
    this.selectBox.style.position = "absolute";
    this.selectBox.style.border = "1px solid " + outlineColor;
    this.selectBox.style.backgroundColor = fillColor;
    this.selectBox.style.pointerEvents = "none";
    this.selectBox.style.zIndex = "999";

    this.certainReceptionDom = receptionDom || document.body;
    this.certainReceptionDom.appendChild(that.selectBox);
    this.certainReceptionDom.addEventListener(
      "pointerdown",
      that.selectAreaMouseDown
    );

    this.selectedDomEvent = new CustomEvent("SelectedDoms", {
      bubbles: true,
      cancelable: true,
      detail: that.selectedDoms,
    });
  }

  getRelativeMousePosition = (event) => {
    var rect = this.certainReceptionDom.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  selectAreaMouseDown = (e) => {
    let that = this;

    const relativeMousePosition = that.getRelativeMousePosition(e);

    this.startX = relativeMousePosition.x;
    this.startY = relativeMousePosition.y;
    this.selectBox.style.left = this.startX + "px";
    this.selectBox.style.top = this.startY + "px";
    this.selectBox.style.width = "0px";
    this.selectBox.style.height = "0px";
    this.selectBox.style.display = "block";

    this.certainReceptionDom.addEventListener(
      "pointermove",
      that.selectAreaMouseMove
    );
    document.addEventListener("pointerup", that.selectAreaMouseUp);
  };

  selectAreaMouseMove = (e) => {
    let that = this;

    const relativeMousePosition = that.getRelativeMousePosition(e);

    const width = relativeMousePosition.x - this.startX;
    const height = relativeMousePosition.y - this.startY;

    this.selectBox.style.width = Math.abs(width) + "px";
    this.selectBox.style.height = Math.abs(height) + "px";
    this.selectBox.style.left =
      (width > 0 ? that.startX : relativeMousePosition.x) + "px";
    this.selectBox.style.top =
      (height > 0 ? that.startY : relativeMousePosition.y) + "px";
  };

  selectAreaMouseUp = (e) => {
    let that = this;

    const targetDoms = this.certainReceptionDom.querySelectorAll(
      that.selectTypeString
    );

    console.log("targetDoms:", targetDoms);

    this.selectedDoms.length = 0;
    targetDoms.forEach((targetDom) => {
      const boxRect = targetDom.getBoundingClientRect();
      const selectRect = that.selectBox.getBoundingClientRect();
      if (
        boxRect.left > selectRect.left &&
        boxRect.right < selectRect.right &&
        boxRect.bottom < selectRect.bottom &&
        boxRect.top > selectRect.top
      ) {
        that.selectedDoms.push(targetDom);
      } else {
        //这里预留了对未选中的dom的处理
      }
    });

    this.selectBox.style.display = "none";
    this.certainReceptionDom.dispatchEvent(that.selectedDomEvent);
    if (this.callFn) {
      this.callFn(that.selectedDoms);
    }

    this.certainReceptionDom.removeEventListener(
      "pointermove",
      that.selectAreaMouseMove
    );
    document.removeEventListener("pointerup", that.selectAreaMouseUp);
  };

  cancelBoxSelectedDom = () => {
    let that = this;

    this.certainReceptionDom.removeEventListener(
      "pointerdown",
      that.selectAreaMouseDown
    );
    this.certainReceptionDom.removeEventListener(
      "pointermove",
      that.selectAreaMouseMove
    );
    document.removeEventListener("pointerup", that.selectAreaMouseUp);

    this.certainReceptionDom.removeChild(that.selectBox);
    this.certainReceptionDom = null;
    this.selectBox = null;
    this.selectedDoms.length = 0;
    this.selectedDomEvent = null;
  };

  dispose = () => {
    if (this.callFn) {
      this.callFn = null;
    }
    this.cancelBoxSelectedDom();
    this.selectedDoms = null;
  };
}

export { ReturnBoxSelectedDom };
