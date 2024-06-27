import { AnimatedLabel } from "../../engine/src/component/animatedLabel";
import * as builder from "../../engine/src/component/builder";
import { View } from "../../engine/src/component/component";
import { Image } from "../../engine/src/component/image";
import { Layer } from "../../engine/src/component/layer";
import { SpineAnimation } from "../../engine/src/component/spineAnimation";
import { Register } from "../../engine/src/core/registry";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import { delayAnimatable, delayForSpine } from "../../engine/src/util/async";
import * as tween from "../../engine/src/util/tween";
import { SceneAnimation, setAnimationStatic } from "../animations/sceneAnimation";
import { SND_FREE_SPIN_WIN } from "../constants";
import { getLanguage, playBgm, playTotalWinCoinSound, stopBgm, stopTotalWinCoinSound } from "../scenes/mainScene";

@Register({ tag: "youWonPanel" })
export class YouWonPanel extends View {
  private bigWinLabel: AnimatedLabel;
  private totalWinLabel: AnimatedLabel;
  private bigwinIcon: SpineAnimation;

  private bigwinActive = false;
  private totalWinActive = false;
  private youWonActive = false;

  private getBigWin = () => {
    const container = this["bigwin"] as Layer;
    const spine = container["spine"] as SpineAnimation;
    return { container, spine };
  };
  private getYouWon = () => {
    const container = this["youwon"] as Layer;
    const spine = container["spine"] as SpineAnimation;
    return { container, spine };
  };
  private getTotalWin = () => {
    const container = this["totalwin"] as Layer;
    const spine = container["spine"] as SpineAnimation;

    return { container, spine };
  };

  get scene(): any {
    return this.parent.parent as any;
  }

  get bgp(): any {
    return this.scene.bgp;
  }

  get animation(): SceneAnimation {
    return this.scene.animation;
  }

  showBigWin(amount: number): Promise<any> {
    return new Promise((res) => {
      if (this.bigwinActive) res(true);
      else {
        stopBgm();
        this.bigwinActive = true;
        const bigwin = this.getBigWin();
        bigwin.container.visible = true;

        const spineSlot = bigwin.spine.getSlotContainerByName("BW_Txt_Amount");
        this.bigWinLabel = slotApp.widgetService().get("bigWinPanelLabel") as AnimatedLabel;
        spineSlot.removeChildren();
        bigwin.spine.setSkin(getLanguage(true));
        this.bgp.visible = true;
        tween.fadeIn(
          this.bgp,
          500,
          () => {
            this.animation.playBigWinEffect();
          },
          0.5
        );

        setAnimationStatic(bigwin.spine, "BigWin_Intro", false, () => {
          playTotalWinCoinSound();
          spineSlot.addChild(this.bigWinLabel);
          setAnimationStatic(bigwin.spine, "BigWin_Idle", true);
          delayAnimatable(8000).then(() => {
            stopTotalWinCoinSound();
          });
          this.bigWinLabel.duration = 8000;
          this.bigWinLabel.value = `${amount}`;
         
          // this.bigWinLabel.on(this.bigWinLabel.ON_UPDATE_COMPLETE, () => {
          //   stopTotalWinCoinSound();
          // })
          res(true);
        });

        delayForSpine(500).then(() => {
          setAnimationStatic(this.bigwinIcon, "FlyOut_Normal", true, () => {});
        });
      }
    });
  }

  showTotalWin(amount: number): Promise<any> {
    slotApp.playSound(SND_FREE_SPIN_WIN, "default");
    return new Promise((res) => {
      if (this.totalWinActive) res(true);
      else {
        stopBgm();
        this.totalWinActive = true;
        const totalWin = this.getTotalWin();
        totalWin.container.visible = true;
        totalWin.spine.setSkin(getLanguage(true));
        const spineSlot = totalWin.spine.getSlotContainerByName("TW_Txt_WinningAmount");
        this.totalWinLabel = slotApp.widgetService().get("totalWinPanelLabel") as AnimatedLabel;
        spineSlot.removeChildren();
        this.bgp.visible = true;
        tween.fadeIn(
          this.bgp,
          500,
          () => {
            this.animation.playFreeWinEffect();
          },
          0.5
        );
        setAnimationStatic(totalWin.spine, "TotalWin_Intro", false, () => {
          playTotalWinCoinSound();
          spineSlot.addChild(this.totalWinLabel);
          setAnimationStatic(totalWin.spine, "TotalWin_Idle", true);
          this.totalWinLabel.duration = 3750;
          this.totalWinLabel.value = `${amount}`;
          
          delayAnimatable(3750).then(() => {
            stopTotalWinCoinSound();
          });
          res(true);
        });
        delayForSpine(500).then(() => {
          setAnimationStatic(this.bigwinIcon, "FlyOut_Normal", true, () => {});
        });
      }
    });
  }

  showYouWon(amount: number): Promise<any> {
    return new Promise((res) => {
      if (this.youWonActive) res(true);
      else {
        this.youWonActive = true;
        const youwon = this.getYouWon();
        youwon.container.visible = true;

        const spineSlot = youwon.spine.getSlotContainerByName("YW_Number");
        const spineSlot1 = youwon.spine.getSlotContainerByName("Click");
        const widgetLabel = slotApp.widgetService().get("youWonPanelLabel") as AnimatedLabel;
        const widgetClick = slotApp.widgetService().get("youwonClickTip") as Image;
        spineSlot.removeChildren();
        spineSlot1.removeChildren();
        spineSlot1.addChild(widgetClick);
        youwon.spine.setSkin(getLanguage(true));

        this.bgp.visible = true;
        tween.fadeIn(
          this.bgp,
          500,
          () => {
            this.animation.playGetFreeEffect();
          },
          0.5
        );
        setAnimationStatic(youwon.spine, "YouWon_Intro", false, () => {
          spineSlot.addChild(widgetLabel);
          setAnimationStatic(youwon.spine, "YouWon_Idle", true);
          widgetLabel.value = `${amount}`;
        });
      }
    });
  }

  hideBigWin(amount: number): Promise<any> {
    return new Promise((res) => {
      if (!this.bigwinActive) res(true);
      else {
        this.bigwinActive = false;
        this.bigWinLabel.setValueDirectly(`${amount}`);
        delayAnimatable(1000).then(() => {
          const bigwin = this.getBigWin();
          tween.fadeOut(
            this.bgp,
            500,
            () => {
              this.animation.stopBigWinEffect();
              this.bgp.visible = false;
            },
            0.5,
            0
          );
          setAnimationStatic(bigwin.spine, "BigWin_Outro", false, () => {
            playBgm();
            res(true);
            bigwin.container.visible = false;
            bigwin.spine.animated = false;
          });
          delayForSpine(300).then(() => {
            this.bigwinIcon.animated = false;
            this.bigwinIcon.visible = false;
          });
        });
      }
    });
  }
  hideTotalWin(amount: number): Promise<any> {
    return new Promise((res) => {
      if (!this.totalWinActive) res(true);
      else {
        this.totalWinLabel.setValueDirectly(`${amount}`);
        this.totalWinActive = false;
        delayAnimatable(1000).then(() => {
          const totalWin = this.getTotalWin();
          tween.fadeOut(
            this.bgp,
            500,
            () => {
              
              this.animation.stopFreeWinEffect();
              this.bgp.visible = false;
            },
            0.5,
            0
          );
          
          setAnimationStatic(totalWin.spine, "TotalWin_Outro", false, () => {
            // playBgm();
            res(true);
            totalWin.container.visible = false;
            totalWin.spine.animated = false;
          });
          delayForSpine(300).then(() => {
            this.bigwinIcon.animated = false;
            this.bigwinIcon.visible = false;
          });
        });
      }
    });
  }
  hideYouWon(): Promise<any> {
    return new Promise((res) => {
      if (!this.youWonActive) res(true);
      else {
        this.youWonActive = false;
        delayAnimatable(1000).then(() => {
          const youwon = this.getYouWon();
          tween.fadeOut(
            this.bgp,
            500,
            () => {
              this.animation.stopGetFreeEffect();
              this.bgp.visible = false;
            },
            0.5,
            0
          );
          setAnimationStatic(youwon.spine, "YouWon_Outro", false, () => {
            res(true);
            youwon.container.visible = false;
            youwon.spine.animated = false;
          });
        });
      }
    });
  }

  static create(node: Element, args: builder.BuildArgs) {
    return createObject(YouWonPanel, node, args);
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
