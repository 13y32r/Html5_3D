let startX, startY;
let selectBox;
let selectTypeString;

function returnBoxSelectedDom(selectTypeArray, receptionDom) {
  selectTypeString = selectTypeArray.join(",");

  const certainReceptionDom = receptionDom || document;
}

function selectAreaMouseDown(e) {
  startX = e.clientX;
  startY = e.clientY;
  selectBox.style.left = startX + "px";
  selectBox.style.top = startY + "px";
  selectBox.style.width = "0px";
  selectBox.style.height = "0px";
  selectBox.style.display = "block";
}

function selectAreaMouseMove(e) {
  const width = e.clientX - startX;
  const height = e.clientY - startY;
  selectBox.style.width = Math.abs(width) + "px";
  selectBox.style.height = Math.abs(height) + "px";
  selectBox.style.left = (width > 0 ? startX : e.clientX) + "px";
  selectBox.style.top = (height > 0 ? startY : e.clientY) + "px";
}

function selectAreaMouseUp(e) {
  const boxes = document.querySelectorAll("#box1, #box2");
  boxes.forEach((box) => {
    const boxRect = box.getBoundingClientRect();
    const selectRect = selectBox.getBoundingClientRect();
    if (
      boxRect.left > selectRect.left &&
      boxRect.right < selectRect.right &&
      boxRect.bottom < selectRect.bottom &&
      boxRect.top > selectRect.top
    ) {
      box.style.backgroundColor = "yellow";
    } else {
      box.style.backgroundColor = box.id === "box1" ? "red" : "blue";
    }
  });
}

function cancelBoxSelectedDom(dom) {
  for (var i = 0; i < dom.length; i++) {
    dom[i].checked = false;
  }
}

export { returnBoxSelectedDom, cancelBoxSelectedDom };
