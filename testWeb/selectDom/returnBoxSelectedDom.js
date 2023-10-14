class ReturnBoxSelectedDom {
  constructor(selectTypeArray, receptionDom, callFn) {
    let that = this;

    if (callFn) {
      callFn.bind(that);
      this.callFn = callFn;
    }

    const outlineColor = "blue";
    const fillColor = "blue";

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
    this.selectBox.style.opacity = "0.2";
    this.selectBox.style.pointerEvents = "none";

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

  selectAreaMouseDown = (e) => {
    let that = this;

    this.startX = e.clientX;
    this.startY = e.clientY;
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

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;
    this.selectBox.style.width = Math.abs(width) + "px";
    this.selectBox.style.height = Math.abs(height) + "px";
    this.selectBox.style.left = (width > 0 ? that.startX : e.clientX) + "px";
    this.selectBox.style.top = (height > 0 ? that.startY : e.clientY) + "px";
  };

  selectAreaMouseUp = (e) => {
    let that = this;

    const targetDoms = this.certainReceptionDom.querySelectorAll(
      that.selectTypeString
    );
    this.selectedDoms.length = 0;
    targetDoms.forEach((targetDom) => {
      const boxRect = targetDom.getBoundingClientRect();
      const selectRect = this.selectBox.getBoundingClientRect();
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
      this.callFn();
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
    this.certainReceptionDom.removeChild(that.selectBox);
    this.certainReceptionDom = null;
    this.selectBox = null;
    this.selectedDoms.length = 0;
    this.selectedDomEvent = null;
  };

  dispose = () => {
    this.selectedDoms = null;
    if (this.callFn) {
      this.callFn = null;
    }
    this.cancelBoxSelectedDom();
  };
}

export { ReturnBoxSelectedDom };
