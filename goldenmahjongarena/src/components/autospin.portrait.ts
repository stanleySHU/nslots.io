import * as builder from "../../engine/src/component/builder";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { AutoSpinBase } from "../../engine/src/slotMachine/component/autoSpin.base";
import * as base from "../../engine/src/slotMachine/component/autoSpin.shared";
import { HtmlLayer } from "../../engine/src/slotMachine/component/htmlLayer";

@Register({ tag: "autoSpin" })
export class AutoSpin extends base.AutoSpin {
  initCloseClickable() {
    if (this["clickable"]) {
      this["clickable"].interactive = true;
      this["clickable"].on("mouseup", () => this.close(true), this).on("touchend", () => this.close(true), this);
    }
    if (this.advanced["customBox"]) {
      this.advanced["customBox"].interactive = true;
    }
    if (this.advanced["winexceedsBox"]) {
      this.advanced["winexceedsBox"].interactive = true;
    }
    if (this.advanced["balanceincreassesBox"]) {
      this.advanced["balanceincreassesBox"].interactive = true;
    }
    this.advanced["panelBG-p"].interactive = true;
    this.advanced["panelBG-p"].on("mouseup", () => this.onBlurInputs(), this).on("touchend", () => this.onBlurInputs(), this);

    const t = this.getComponentByID("startautospinBtn") as any;
    if (t) t.y += 10;
  }

  protected setKeyboardPosition() {
    if (this.currentBox && this.keyboard && this.keyboard.visible) {
      const keyboardX = this.advanced.x + this.currentBox.x + this.currentBox.width - this.keyboard.width;
      const keyboardY = this.advanced.y - director.options.height * (1 / 1.5) + this.currentBox.y - this.currentBox.height - this.keyboard.height;
      this.keyboard.position.set(keyboardX, keyboardY);
    }
  }

  protected setTextInput(input: HTMLInputElement, name: string, value: number = 0) {
    if (!this.advanced.visible) {
      this.clearTextInputs();
      return input;
    }
    const canvas: HTMLElement = HtmlLayer.canvas;
    let x = parseFloat(canvas.style.marginLeft);
    let y = parseFloat(canvas.style.marginTop);
    const boxW = this.advanced[name].width - 3;
    const boxH = this.advanced[name].height - 5;
    let scale: number = Math.min(director.stage.scale.x, director.stage.scale.y) * 1.5;
    if (this.isDesktop && director.options.width < this.MIN_WIDTH && director.options.canvas.width > this.MIN_WIDTH) {
      x = 0;
      y = 0;
      if (director.options.canvas.width > this.MAX_WIDTH) {
        scale = this.MAX_WIDTH / director.options.width;
      }
    }
    const textIndent = parseFloat(this.textInputOption.textIndent) * scale;
    const width = boxW * scale - textIndent * 2;
    const height = boxH * scale;
    const size = scale * this.textInputOption.fontSize;
    const left = x + (this.parent.x + this.x + this.advanced.x - this.advanced.pivot.x + this.advanced[name].x) * scale;
    const top = y + (this.parent.y + this.y + this.advanced.y - this.advanced.pivot.y + this.advanced[name].y) * scale;

    if (input) {
      input.style.visibility = "hidden";
    } else {
      input = document.createElement("input");
      input.type = this.textInputOption.type;
      input.min = this.textInputOption.min;
      input.max = this.textInputOption.max;
      input.contentEditable = this.textInputOption.contentEditable;
      input.style.fontFamily = this.textInputOption.fontFamily;
      input.style.textAlign = this.textInputOption.textAlign;
      input.style.color = this.textInputOption.color;
      input.style.position = this.textInputOption.position;
      input.style.background = this.textInputOption.background;
      input.style.border = this.textInputOption.border;
      input.style.outline = this.textInputOption.outline;
      input.id = name;
      if (value > 0) {
        input.value = value.toString();
      }
      canvas.parentElement.insertBefore(input, canvas);
      input.addEventListener("focus", (event) => this.onFocusInput(event), true);
      input.addEventListener("keypress", (event) => this.validateInputs(event), true);
      input.addEventListener("keyup", (event) => this.checkInputs(event), true);
    }

    input.style.fontSize = `${size}px`;
    input.style.width = `${width}px`;
    input.style.height = `${height}px`;
    input.style.marginTop = `${top}px`;
    input.style.marginLeft = `${left}px`;
    input.style.paddingLeft = input.style.paddingRight = `${textIndent}px`;
    input.style.visibility = "visible";
    return input;
  }

  static create(node: Element, args: builder.BuildArgs) {
    const autoSpin: AutoSpin = AutoSpinBase.createAutoSpin(AutoSpin, node, args);
    return autoSpin;
  }
}
