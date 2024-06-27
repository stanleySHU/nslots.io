import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { OrientationService } from "../../engine/src/services/orientationService";
import { createInfoPanel } from "../../engine/src/slotMachine/component/infoPanel";
import { InfoPanel as _InfoPanel } from "../../engine/src/slotMachine/component/infoPanel.shared";

export class InfoPanel extends _InfoPanel {
  setIndicatorsPoistion(init: boolean = false) {
    const numPages = this.options.numPages;
    if (numPages < 2) return;
    const o = director.services.get<OrientationService>("orientationService").getOrientation();
    for (let i = 0; i < numPages; i++) {
      const indOn = this.indicators[i].on;
      const indOff = this.indicators[i].off;

      const y = director.options.minHeight - this.options.indicatorOffsetYL;
      const x = (director.options.minWidth - this.options.indicatorGap * (numPages - 1) - indOn.width) / 2 + i * this.options.indicatorGap;

      indOn.y = indOff.y = y;
      indOn.x = indOff.x = x;
      if (init) this.setIndicatorHandler(indOff, i);
    }
    this.updatedHitArea(o === Orientation.LANDSCAPE ? director.options.width : director.options.height);
  }

  static create(node: Element, args: any) {
    const info = createInfoPanel(InfoPanel, node, args);
    return info;
  }
}
