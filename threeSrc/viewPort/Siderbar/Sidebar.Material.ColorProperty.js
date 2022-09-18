import { UIColor, UINumber, UIRow, UIText } from "../../libs/ui.js";
import { SetMaterialColorCommand } from "../../editor/commands/SetMaterialColorCommand.js";
import { SetMaterialValueCommand } from "../../editor/commands/SetMaterialValueCommand.js";

function SidebarMaterialColorProperty(editor, property, name) {
  const signals = editor.signals;

  const container = new UIRow();
  container.add(new UIText(name).setWidth("90px"));

  const color = new UIColor().onInput(onChange);
  container.add(color);

  let intensity;

  if (property === "emissive") {
    intensity = new UINumber().setWidth("30px").onChange(onChange);
    container.add(intensity);
  }

  let object = null;
  let material = null;

  function onChange() {
    if (material[property].getHex() !== color.getHexValue()) {
      editor.execute(
        new SetMaterialColorCommand(
          editor,
          object,
          property,
          color.getHexValue(),
          0 /* TODO: currentMaterialSlot */
        )
      );
    }

    if (intensity !== undefined) {
      if (material[`${property}Intensity`] !== intensity.getValue()) {
        editor.execute(
          new SetMaterialValueCommand(
            editor,
            object,
            `${property}Intensity`,
            intensity.getValue(),
            /* TODO: currentMaterialSlot*/ 0
          )
        );
      }
    }
  }

  function update() {
    if (object === null || object === undefined) return;
    if (object.material === undefined) return;

    material = object.material;

    if (property in material) {
      color.setHexValue(material[property].getHexString());

      if (intensity !== undefined) {
        intensity.setValue(material[`${property}Intensity`]);
      }

      container.setDisplay("");
    } else {
      container.setDisplay("none");
    }
  }

  //
  function getSelectedObj(selected) {
    object = selected[0];

    update();
  }

  signals.objectSelected.add(getSelectedObj);

  signals.hierarchyChange.add(function () {
    let objects = editor.selectionHelper.selectedObject;
    getSelectedObj(objects);
  });

  signals.materialChanged.add(update);

  return container;
}

export { SidebarMaterialColorProperty };
