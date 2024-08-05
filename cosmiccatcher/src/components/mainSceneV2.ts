import { IBingoSlotContext } from "../../engine/src/bingoSlot/model/types";
import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import { ButtonSlide } from "../../engine/src/component/button.slide";
import { Layer } from "../../engine/src/component/layer";
import { inject, service } from "../../engine/src/core/bindings";
import { Orientation } from "../../engine/src/core/types";
import * as director from "../../engine/src/director";
import { Scene } from "../../engine/src/scene";
import { DeviceService } from "../../engine/src/services/deviceService";
import { LayoutService } from "../../engine/src/services/layoutService";
import { OrientationService } from "../../engine/src/services/orientationService";
import { SoundService } from "../../engine/src/services/soundService";
import {
  BetSelection,
  EVENTS_ON_BET_SELECTION_CHANGED,
  EVENTS_ON_BET_SELECTION_VISIBILITY
} from "../../engine/src/slotMachine/component/betSelection";
import { FooterBar } from "../../engine/src/slotMachine/component/footerBar.shared";
import { Menu } from "../../engine/src/slotMachine/component/menu.mobile";
import { ISlotContext } from "../../engine/src/slotMachine/model/types";
import { User } from "../../engine/src/slotMachine/model/user";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { tracker } from "../../engine/src/tracking/tracker";
import * as browser from "../../engine/src/util/browser";
import { truncate } from "../../engine/src/util/string";
import * as vibration from "../../engine/src/util/vibration";
import { SlotService } from "../services/slotService.json";

export class MainScene extends Scene {
  @service("netService")
  protected netService: SlotService;

  @service("deviceService")
  deviceService: DeviceService;
  @service("soundService")
  soundService: SoundService;
  @inject("context")
  context: ISlotContext & IBingoSlotContext;
  @service("layoutService")
  layoutService: LayoutService;
  @inject("user")
  player: User;

  footerBar: FooterBar;
  menu: Menu;
  betAmount: AnimatedLabel;
  selectionPanel: Layer & { betSelection: BetSelection };
  menuBtnLayer: Layer & {
    btnMenu: ButtonSlide;
    realPlay: ButtonSlide;
    fund: ButtonSlide;
  };

  onCreated() {
    super.onCreated();

    this.initFooterLabels();
    this.onSceneResize();
    this.initCommand();
    this.updateBetAmount();
    this.updateFooterBar();
    this.initBetSelection();

    this.menuBtnLayer.realPlay.visible = this.realPlayVisible;
    this.menuBtnLayer.fund.visible = this.fundVisible;
  }

  exit() {
    super.exit();
    director.inputManager.off("infoPage");
    director.inputManager.off("spin");
    director.inputManager.off("betSelection");
    director.inputManager.off("lobby");
    director.inputManager.off("home");
    director.inputManager.off("help");
    director.inputManager.off("livechat");
    director.inputManager.off("history");
  }

  onSpin() {
    // if (!director.device.desktop) this.deviceService.setDeviceFullscreen();
  }

  initCommand() {
    director.inputManager.on("history", () => this.clickHistoryHandler());
    director.inputManager.on("livechat", () => this.clickLiveChatHandler());
    director.inputManager.on("help", () => this.clickHelpHandler());
    director.inputManager.on("home", () => this.clickHomeHandler());
    director.inputManager.on("lobby", () => this.clickExitHandler());
    director.inputManager.on("infoPage", () => {
      director.sceneManager.replace("infoPage");
    });
    director.inputManager.on("spin", this.onSpin.bind(this));
    director.inputManager.on("betSelection", () => this.clickBetSelectionHandler());
  }

  initFooterLabels() {
    this.betAmount = this.footerBar.getComponentByID("betAmount") as AnimatedLabel;
  }

  checkDeviceResize(offset) {
    const or = director.services.get<OrientationService>("orientationService").getOrientation();
    if (or == Orientation.PORTRAIT) {
      this.menuBtnLayer.realPlay.y = this.menuBtnLayer.fund.y = this.menuBtnLayer.btnMenu.y = director.options.width - offset.y - 120;
      this.menuBtnLayer.realPlay.x = this.menuBtnLayer.fund.x = director.options.height - offset.x - 40;
      this.footerBar["panels"].y = this.selectionPanel.y = director.options.width - offset.y - 1060;
      this.selectionPanel.y = director.options.width - offset.y - 1060;
    } else {
      this.menuBtnLayer.realPlay.y = this.menuBtnLayer.fund.y = this.menuBtnLayer.btnMenu.y = director.options.height - offset.y - 40;
      this.menuBtnLayer.realPlay.x = this.menuBtnLayer.fund.x = director.options.width - offset.x - 40;
      this.footerBar["panels"].y = this.selectionPanel.y = director.options.height - offset.y - 640;
      this.selectionPanel.y = director.options.height - offset.y - 640;
    }
    this.menuBtnLayer.btnMenu.x = offset.x + 40;
    this.menu.y = -offset.y;
  }

  setComponentsPositions(offset) {
    const or = director.services.get<OrientationService>("orientationService").getOrientation();
    if (or == Orientation.PORTRAIT) {
      this.menu.buttonCloseLandscape.x = this.menu.buttonClosePortrait.x = (director.options.height - offset.x - 40) * 1.5;
    } else {
      this.menu.buttonCloseLandscape.x = this.menu.buttonClosePortrait.x = (director.options.width - offset.x - 40) * 1.5;
    }
    this.footerBar["timebox"].position.set(-offset.x, offset.y);
  }

  onSceneResize() {
    const layout = director.services.get<LayoutService>("layoutService");
    const offset = {
      x: -Math.min(0, layout.offsetX),
      y: -Math.min(0, layout.offsetY)
    };

    this.setComponentsPositions(offset);
    this.checkDeviceResize(offset);
  }

  animateFooterBar(directWin?: boolean) {
    this.updateTotalBet();
    this.animateBalanceAmount();
  }

  updateFooterBar(directWin?: boolean) {
    this.updateTotalBet();
    this.updateBalanceAmount();
  }

  animateBalanceAmount(value?) {
    this.footerBar.animateBalance(value || this.player.balance);
  }

  updateBalanceAmount(value?) {
    this.footerBar.updateBalance(value || this.player.balance);
  }

  updateTotalBet() {
    this.footerBar.updateTotalBet(this.player.displayedTotalBet);
  }

  updateBetAmount() {
    if (this.betAmount) {
      this.betAmount.value = truncate(this.player.displayedBetAmount);
    }
  }

  betChangedHandler(index) {
    this.player.betValueIndex = index;
    this.updateTotalBet();
    this.updateBalanceAmount();
    this.updateBetAmount();
  }

  betSelectionVisibilityHandler(visible: boolean) {
    // this.iconBetExpandable.scale.y = visible ? -1 : 1;
  }

  clickBetSelectionHandler() {
    if (this.selectionPanel.betSelection) {
      if (this.selectionPanel.betSelection.visible) {
        this.selectionPanel.betSelection.close();
      } else if (this.selectionPanel.betSelection.open()) {
      }
    }
  }

  initBetSelection() {
    this.selectionPanel.betSelection.setValues(this.player.betValues.concat(), this.player.betValueIndex);
    this.selectionPanel.betSelection.on(EVENTS_ON_BET_SELECTION_CHANGED, (x) => this.betChangedHandler(x));
    this.selectionPanel.betSelection.on(EVENTS_ON_BET_SELECTION_VISIBILITY, (x) => this.betSelectionVisibilityHandler(x));
    this.updateTotalBet();
  }

  get fundVisible() {
    return !this.context.FUNPLAY && !!this.context.FUNDS_URL;
  }

  get realPlayVisible() {
    return this.context.FUNPLAY && !!this.context.LOGIN_URL;
  }

  //
  onOpenMenu() {
    this.menu.open();
  }

  onOpenRealplay() {
    browser.open(this.context.realPlayUrl);
  }

  onOpenFundtransfer() {
    browser.openNewWindow(this.context.FUNDS_URL);
  }

  clickExitHandler() {
    browser.open(this.context.realLobbyUrl);
  }

  clickHelpHandler() {
    browser.openNewWindow(this.context.helpUrl);
  }

  clickHomeHandler() {
    browser.open(this.context.HOME_URL);
  }

  clickLiveChatHandler() {
    browser.openNewWindow(this.context.livechatUrl, "LiveChat");
  }

  clickVibrationHandler(sender) {
    vibration.setVibrationOn(sender.selected);
    tracker.event({
      name: "vibration",
      properties: { Action: sender.selected ? "On" : "Off" },
      measurements: {}
    });
  }

  clickSoundHandler(sender) {
    this.soundService.muted = sender.selected;
    tracker.event({
      name: "mute sound",
      properties: { Action: this.soundService.muted ? "Off" : "On" },
      measurements: {}
    });
  }

  clickHistoryHandler() {
    slotApp.showshistory();
  }
}
