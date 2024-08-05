import { main } from "../engine/src/appbase";
import { AnimatedLabel } from "../engine/src/component/animatedLabel";
import { Button } from "../engine/src/component/button";
import { ButtonSlide } from "../engine/src/component/button.slide";
import { Circle } from "../engine/src/component/circle";
import { Image } from "../engine/src/component/image";
import { Label } from "../engine/src/component/label";
import { Layer } from "../engine/src/component/layer";
import { Mask } from "../engine/src/component/mask";
import { MovieClip } from "../engine/src/component/movieClip";
import { Rectangle } from "../engine/src/component/rectangle";
import { Slide } from "../engine/src/component/slide";
import { SpineAnimation } from "../engine/src/component/spineAnimation";
import { ToggleButton } from "../engine/src/component/toggleButton";
import { Widget } from "../engine/src/component/widget";
import * as registry from "../engine/src/core/registry";
import { KeyboardService } from "../engine/src/services/keyboardService";
import { BetSelection } from "../engine/src/slotMachine/component/betSelection";
import { CheatBar } from "../engine/src/slotMachine/component/cheatBar";
import { FooterBar } from "../engine/src/slotMachine/component/footerBar.shared";
import { HudMessage } from "../engine/src/slotMachine/component/hudMessage";
import { InfoPanel } from "../engine/src/slotMachine/component/infoPanel.shared";
import { LangLabel } from "../engine/src/slotMachine/component/langLabel";
import { Menu } from "../engine/src/slotMachine/component/menu.mobile";
import { InfoPageScene } from "./components/InfoPageScene";
import { LoginScene } from "./components/loginScene";
import { LayoutService } from "./services/layoutService";
import { SlotService } from "./services/slotService.json";

registry.enable([
  LayoutService,
  Carousel,
  BetSelection,
  InfoPageScene,
  CheatBar,
  InfoPanel,
  Circle,
  LangLabel,
  ToggleButton,
  Rectangle,
  Menu,
  FooterBar,
  Slide,
  AnimatedLabel,
  Image,
  Label,
  Layer,
  LoginScene,
  KeyboardService,
  SlotService,
  Button,
  Widget,
  SpineAnimation,
  Mask,
  MovieClip,
  ButtonSlide,
  HudMessage
]);

import { Carousel } from "../engine/src/component/carousel";
import { BetPanel } from "./components/betPanel";
import { BonusEffect } from "./components/bonusEffect";
import { Chase } from "./components/chase";
import { DoubleSelecter } from "./components/doubleSelecter";
import { MainScene } from "./components/mainScene";
import { Reel } from "./components/reel";
import { SplashScene } from "./components/splashScene";
import { Symbol } from "./components/symbol";
import { WinPanel } from "./components/winPanel";

registry.enable([SplashScene, MainScene, BetPanel, Reel, Symbol, DoubleSelecter, BonusEffect, WinPanel, Chase]);

main();
