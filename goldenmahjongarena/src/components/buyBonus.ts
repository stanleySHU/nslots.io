import * as builder from "../../engine/src/component/builder";
import { Button } from "../../engine/src/component/button";
import { View } from "../../engine/src/component/component";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { setAnimationStatic } from "../animations/sceneAnimation";
import { CREDIT_FREESPINS, CREDIT_SUPER_FREESPINS } from "../constants";
import { GameMainScene } from "../scenes/mainScene.mobile";

@Register({ tag: "buyBonus" })
export class BuyBonus extends View {
  static EVENTS_BUY_BONUS_CONFIRMED = "events:buybonus:confirmed";
  static EVENTS_BUY_BONUS_CLOSED = "events:buybonus:closed";
  private mode: "fs" | "sfs" = "sfs";
  buyBonusLabel: Button & { currency: Label; label: Label; up: Image };

  private container: Layer & {
    close: Button & { box: Layer };
    bannerFSClick: Button & { box: Layer };
    bannerSFSClick: Button & { box: Layer };
    bannerBuyInButton: Button & { box: Layer };
    bannerFS: SpineAnimation;
    bannerSFS: SpineAnimation;
    spine: SpineAnimation;
  };

  get scene() {
    return this.parent as GameMainScene;
  }

  onCreate() {
    this.container.bannerBuyInButton.box.cursor =
      this.container.bannerFSClick.box.cursor =
      this.container.bannerSFSClick.box.cursor =
      this.container.close.box.cursor =
        "pointer";

    const spineSlotTitle = this.container.spine.getSlotContainerByName("BuyBonusText");
    const title = slotApp.widgetService().get("bonusBuyTitle") as Layer;
    spineSlotTitle.removeChildren();
    spineSlotTitle.addChild(title);

    const b1 = slotApp.widgetService().get("buyBonusCloseBtn") as Layer;
    const b2 = slotApp.widgetService().get("bannerBuyInButton") as Layer;
    spineSlotTitle.addChild(b1);
    spineSlotTitle.addChild(b2);
    this.buyBonusLabel = b2 as any;

    const spineSlotTitle_fs3 = this.container.bannerFS.getSlotContainerByName("BannerText3");
    const bonusBuyIn_fs3 = slotApp.widgetService().get("bonusMaxRandomCount") as Layer;
    spineSlotTitle_fs3.removeChildren();
    spineSlotTitle_fs3.addChild(bonusBuyIn_fs3);

    const spineSlotTitle_sfs3 = this.container.bannerSFS.getSlotContainerByName("BannerText3");
    const bonusBuyIn_sfs3 = slotApp.widgetService().get("bonusMaxRandomCount") as Layer;
    spineSlotTitle_sfs3.removeChildren();
    spineSlotTitle_sfs3.addChild(bonusBuyIn_sfs3);

    const spineSlotTitle_fs2 = this.container.bannerFS.getSlotContainerByName("BannerText2");
    const bonusBuyIn_fs2 = slotApp.widgetService().get("bonusMaxUp10") as Layer;
    spineSlotTitle_fs2.removeChildren();
    spineSlotTitle_fs2.addChild(bonusBuyIn_fs2);

    const spineSlotTitle_sfs2 = this.container.bannerSFS.getSlotContainerByName("BannerText2");
    const bonusBuyIn_sfs2 = slotApp.widgetService().get("bonusMaxUp50") as Layer;
    spineSlotTitle_sfs2.removeChildren();
    spineSlotTitle_sfs2.addChild(bonusBuyIn_sfs2);

    const spineSlotTitle_fs1 = this.container.bannerFS.getSlotContainerByName("BannerText1");
    const bonusBuyIn_fs1 = slotApp.widgetService().get("bonusBuyFsT") as Layer;
    spineSlotTitle_fs1.removeChildren();
    spineSlotTitle_fs1.addChild(bonusBuyIn_fs1);

    const spineSlotTitle_sfs1 = this.container.bannerSFS.getSlotContainerByName("BannerText1");
    const bonusBuyIn_sfs1 = slotApp.widgetService().get("bonusBuySFsT") as Layer;
    spineSlotTitle_sfs1.removeChildren();
    spineSlotTitle_sfs1.addChild(bonusBuyIn_sfs1);
  }

  openBuyBonus() {
    this.container.bannerBuyInButton.enabled = false;
    this.container.visible = true;

    setAnimationStatic(this.container.spine, "BuyBonus_Intro", false, () => {
      setAnimationStatic(this.container.spine, "BuyBonus_Still", true, () => {});
      this.enableButtons(true);
    });

    this.container.bannerFS.visible = true;
    setAnimationStatic(this.container.bannerFS, "Banner_Intro", false, () => {
      setAnimationStatic(this.container.bannerFS, this.mode == "fs" ? "Banner_IdleSelected" : "Banner_IdleDefault", true);
      this.container.bannerBuyInButton.enabled = true;
    });

    this.container.bannerSFS.visible = true;
    setAnimationStatic(this.container.bannerSFS, "Banner_Intro", false, () => {
      setAnimationStatic(this.container.bannerSFS, this.mode == "sfs" ? "Banner_IdleSelected" : "Banner_IdleDefault", true);
      this.container.bannerBuyInButton.enabled = true;
    });
    this.updateBuyInAmount();
  }
  updateBuyInAmount() {
    const e: number = (slotApp.player().totalBet as any).mul(this.mode == "fs" ? CREDIT_FREESPINS : CREDIT_SUPER_FREESPINS).toNumber();
    this.buyBonusLabel.label.value = `${e}`;
    this.buyBonusLabel.currency.value =  slotApp.translateWord("buy").replace("{%value%}",`${slotApp.player().currency}`) ;

    // if (e > slotApp.player().balance.toNumber()) {
    //   this.buyBonusLabel.up.tint = 0x888888;
    //   this.buyBonusLabel.enabled = false;
    //   this.container.bannerBuyInButton.box.cursor = "default";
    // } else {
    //   this.buyBonusLabel.up.tint = 0xffffff;
    //   this.buyBonusLabel.enabled = true;
    //   this.container.bannerBuyInButton.box.cursor = "pointer";
    // }
  }

  enableButtons(e: boolean) {
    this.container.bannerFSClick.enabled = e;
    this.container.bannerSFSClick.enabled = e;
    this.container.bannerBuyInButton.enabled = e;
    this.container.close.enabled = e;
  }

  onClose(cb?: () => void) {
    this.enableButtons(false);

    setAnimationStatic(this.container.spine, "BuyBonus_Outro", false, () => {
      this.enableButtons(true);
      this.scene.buyBonusOpend = false;
      this.container.visible = false;
      this.scene.buyBonusBtn.enabled = true;
      cb && cb();
    });
  }

  onBuyInBonusConfirmed() {
    // if (this.buyBonusLabel.enabled) {
    slotApp.playSound("sfx_button_bonus_purchase", "default", false, true);
    this.onClose(() => {
      this.emit(BuyBonus.EVENTS_BUY_BONUS_CONFIRMED, this.mode);
    });
    // }
  }

  onSelectedFs() {
    this.mode = "fs";
    this.updateBuyInAmount();
    setAnimationStatic(this.container.bannerFS, "Banner_IdleSelected", true);
    setAnimationStatic(this.container.bannerSFS, "Banner_IdleDefault", true);
    this.container.setChildIndex(this.container.bannerFS, 3);
  }

  onSelectedSFs() {
    this.mode = "sfs";
    this.updateBuyInAmount();
    setAnimationStatic(this.container.bannerSFS, "Banner_IdleSelected", true);
    setAnimationStatic(this.container.bannerFS, "Banner_IdleDefault", true);
    this.container.setChildIndex(this.container.bannerSFS, 3);
  }

  static create(node: Element, args: builder.BuildArgs) {
    const t = createObject(BuyBonus, node, args);
    t.onCreate();
    return t;
  }
}

export function createObject(type: any, node: Element, args: builder.BuildArgs) {
  const objType = new type();

  builder.createChildren(node, {
    scene: args.scene,
    parent: objType,
    context: args.context
  });
  builder.setProperties(objType, node, args);
  return objType;
}
