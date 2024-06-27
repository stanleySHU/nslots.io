import { main } from "../engine/src/appbase";

import * as registry from "../engine/src/core/registry";
import * as director from "../engine/src/director";
import * as tracker from "../engine/src/tracking/tracker";

import { AnimatedLabel } from "../engine/src/component/animatedLabel";
import { Callout } from "../engine/src/component/callout";
import { Image } from "../engine/src/component/image";
import { Layer } from "../engine/src/component/layer";
import { Mask } from "../engine/src/component/mask";
import { MovieClip } from "../engine/src/component/movieClip";
import { Polygon } from "../engine/src/component/polygon";
import { Rectangle } from "../engine/src/component/rectangle";
import { Selection } from "../engine/src/component/selection";
import { Slide } from "../engine/src/component/slide";
import { ToggleButton } from "../engine/src/component/toggleButton";
import { ToggleGroup } from "../engine/src/component/toggleGroup";
import { KeyboardService } from "../engine/src/services/keyboardService";
import { Animation } from "../engine/src/slotMachine/component/animation";
import { FooterBar } from "../engine/src/slotMachine/component/footerBar.shared";
import { SlotService } from "../engine/src/slotMachine/net/slotService.json";
import { WinLineService } from "../engine/src/slotMachine/services/winLineService";
import { Label } from "./components/label";

import { Circle } from "../engine/src/component/circle";
import { SpineAnimation } from "../engine/src/component/spineAnimation";
import { CheatBar } from "../engine/src/slotMachine/component/cheatBar";
import { FroundToggle } from "../engine/src/slotMachine/component/froundToggle";
import { LangLabel } from "../engine/src/slotMachine/component/langLabel";
import { Tournament } from "../engine/src/slotMachine/component/tournament";

import { SlotContext } from "../engine/src/slotMachine/model/line5x5_collapse";
import { ApplicationInsightsListener } from "../engine/src/tracking/applicationInsightsListener";
import { ConsoleListener } from "../engine/src/tracking/consoleListener";

import { Button } from "../engine/src/component/button";
import { ButtonSlide } from "../engine/src/component/button.slide";
import { ComboBox } from "../engine/src/component/comboBox";
import { View } from "../engine/src/component/component";
import { TrackBar } from "../engine/src/component/trackBar";
import { TweenService } from "../engine/src/component/tween";
import { BetPanel } from "../engine/src/slotMachine/component/betPanel.mobile";
import { BetSelection } from "../engine/src/slotMachine/component/betSelection";
import { HudMessage } from "../engine/src/slotMachine/component/hudMessage";
import { Menu } from "../engine/src/slotMachine/component/menu.mobile";
import { SpinButton } from "../engine/src/slotMachine/component/spinButton.shared";
import { InfoPageScene } from "../engine/src/slotMachine/scenes/infoPageScene";
import { InfoPanel } from "./components/InfoPanel";
import { AutoSpin } from "./components/autospin.portrait";
import { Carousel } from "./components/carousel";
import { GameMainScene } from "./scenes/mainScene.mobile";
import { GameIdle, GameSpin } from "./scenes/sceneStates";

import { LoginScene } from "./scenes/loginScene";
import { SplashScene } from "./scenes/splashScene";

import { CollapseAnimator2 } from "./components/collapseAnimator2";
import { ReelsCollapsing } from "./components/reelsCollapsing";

import { InBackAnimator } from "./components/InBackAnimatorAll";
import { AdBar } from "./components/adBar";
import { BuyBonus } from "./components/buyBonus";
import { MahjongMultiplier } from "./components/mahjongMultiplier";
import { MainUI } from "./components/mainUI";
import { TotalWinPanel } from "./components/totalWinPanel";
import { YouWonPanel } from "./components/youWonPanel";

registry.enable([
  Callout,
  Image,
  Label,
  Layer,
  MovieClip,
  ReelsCollapsing,
  SlotService,
  Animation,
  ToggleButton,
  FroundToggle,
  ToggleGroup,
  Selection,
  Rectangle,
  Polygon,
  AnimatedLabel,
  FooterBar,
  LangLabel,
  CheatBar,
  Tournament,
  Mask,
  LoginScene,
  SplashScene,
  KeyboardService,
  SpineAnimation,
  Circle,
  Slide,
  HudMessage
]);

registry.enable([
  SpinButton,
  InfoPanel,
  Menu,
  BetSelection,
  GameMainScene,
  BetPanel,
  AutoSpin,
  Carousel,
  ComboBox,
  TrackBar,
  Button,
  ButtonSlide,
  InfoPageScene,
  MahjongMultiplier,
  BuyBonus,
  TotalWinPanel,
  YouWonPanel,
  MainUI,
  AdBar
]);

tracker.configureListeners([ConsoleListener, ApplicationInsightsListener]);

director.injector.map("idleState").toType(GameIdle);
director.injector.map("spinState").toType(GameSpin);
director.injector.map("context").toSingleton(SlotContext);
director.services.register("winLineService", new WinLineService());

// const reelsAnimator = new CollapseAnimator();
// reelsAnimator.acceleration = 2;
// reelsAnimator.bounceFactor = 0.22;
// reelsAnimator.symbolDropTimeGap = 20;
// reelsAnimator.reelDropTimeGap = 60;
const reelsAnimator = new InBackAnimator({
  maxSpeed: 60,
  startSpeed: 0,
  stopSpeed: -15,
  acceleration: 4,
  deceleration: 10
});

const reelsCollapsingAnimator = new CollapseAnimator2();
reelsCollapsingAnimator.acceleration = 10; // 1.5;
reelsCollapsingAnimator.bounceFactor = 0.22;
reelsCollapsingAnimator.symbolDropTimeGap = 20; //28;
reelsCollapsingAnimator.reelDropTimeGap = 60; //80;

director.injector.map("reelsAnimator").toValue(reelsAnimator);
director.injector.map("reelsCollapsingAnimator").toValue(reelsCollapsingAnimator);

const tweenService = director.services.get<TweenService>("tweenService");
const _symbolWidth = 116;
const _symbolHeight = 116;

tweenService.register("symbol-anim", (target: View, node: Element) => {
  const x = target.x;
  const y = target.y;
  const scale = 0.7;
  const dScale = (scale - 1) / 2.0;
  const properties = { scale: 1, x: x, y: y };
  const outTween = new TWEEN.Tween(properties)
    .to({ scale: scale, x: x - dScale * _symbolWidth, y: y - dScale * _symbolHeight }, 600)
    .easing(TWEEN.Easing.Elastic.In)
    .onUpdate((x) => {
      target.scale.set(properties.scale, properties.scale);
      target.x = properties.x;
      target.y = properties.y;
    });
  const inTween = new TWEEN.Tween(properties)
    .to({ scale: 1.0, x: x, y: y }, 600)
    .easing(TWEEN.Easing.Elastic.Out)
    .onUpdate((x) => {
      target.scale.set(properties.scale, properties.scale);
      target.x = properties.x;
      target.y = properties.y;
    });
  outTween.chain(inTween.chain(outTween));
  return outTween;
});

main();
