import { Animatable } from "../../engine/src/animation/animatable";
import { Image } from "../../engine/src/component/image";
import { Label } from "../../engine/src/component/label";
import { inject, service } from "../../engine/src/core/bindings";
import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { Scene } from "../../engine/src/scene";
import { HtmlLayer } from "../../engine/src/slotMachine/component/htmlLayer";
import { ISlotContext } from "../../engine/src/slotMachine/model/types";
import { parseBonus } from "../../engine/src/slotMachine/parser/jsonParser";
import { NetService } from "../../engine/src/slotMachine/services/services";
import * as slotApp from "../../engine/src/slotMachine/slotApp";
import * as arr from "../../engine/src/util/array";
import { User } from "../components/user";
import * as main from "../scenes/mainScene";

@Register({ tag: "login", category: "scene" })
export class LoginScene extends Scene implements Animatable {
  @inject("context")
  protected context: ISlotContext;
  @service("netService")
  protected netService: NetService;
  @inject("user")
  protected player: User;
  circle: Image;
  version: Label;

  enter() {
    super.enter();
    HtmlLayer.querySelector(".gplogo").hide();
    HtmlLayer.querySelector(".loader").hide();
    if (this.version) this.version.value = "v" + director.appContext.engineVersion;
  }

  onCreated() {
    director.juggler.add(this);
    this.player.bet.lines = parseInt(director.appContext["numBetLines"]);
    if (director.appContext["creditsBetLines"]) this.player.bet.credits = parseInt(director.appContext["creditsBetLines"]);
    this.netService
      .signIn()
      .then((session) => {
        if (this.netService.json) {
          if (session.value) {
            if (session.value.sessionKey) {
              this.context.USER_ID = this.player.sessionKey = session.value.sessionKey;
              if (session.value.memberName) this.player.accountName = this.player.displayName = session.value.memberName;
            } else {
              this.context.USER_ID = this.player.sessionKey = session.value;
            }
          }
        } else {
          this.context.USER_ID = this.player.sessionKey = session.token;
          if (session.name) this.player.accountName = this.player.displayName = session.name;
        }
      })
      .then(() =>
        Promise.all<any>([
          this.netService.getBalance().then((x) => {
            if (this.netService.json) {
              if (x.value) {
                this.player.balance = new Decimal(x.value.amount);
                if (x.value.currency !== undefined) this.player.currency = x.value.currency;
              }
            } else {
              this.player.balance = x.balance;
              this.player.currency = x.currency;
              if (x.userid !== undefined) this.player.accountName = x.userid;
            }
            if (this.context.ANONYMOUS) {
              this.context.TRACKER_USER_ID = this.context.USER_ID;
            } else {
              this.context.TRACKER_USER_ID = this.player.accountName;
              const appInsights = window["appInsights"];
              if (appInsights) {
                appInsights.setAuthenticatedUserContext(this.context.TRACKER_USER_ID);
              }
            }
          }),
          this.netService.getBets().then((x) => {
            if (this.netService.json) {
              if (x.value) {
                director.injector.map("gameState").toValue(x.value);
                this.player.symbols = x.value.wheel.reels;
                this.player.betValues = x.value.coins;
                if (x.value.extraGameSettings && this.context.multiplierAsCreditBet) {
                  const creditBet = x.value.extraGameSettings.creditBet;
                  this.player.multiplierValues = creditBet ? creditBet : x.value.multipliers;
                } else this.player.multiplierValues = x.value.multipliers;
                this.player.bet.amount = x.value.coins[0];
                this.player.setDefaultBet();
                this.player.betValue = x.value.bet || x.value.coins[0];
                this.player.demo = x.value.funPlayDemo ? "1" : "0";
                this.player.getBet = x.value;
                this.player.bonus = parseBonus(x);
                if (this.player.bonus) {
                  this.player.restoreBonus = true;
                  if (this.player.bonus.wheels) {
                    this.player.symbols = this.player.bonus.wheels;
                  }
                }
                main.changeReelsFrom45554To66666(this.player.symbols);
                if (x.value.multiplier) {
                  const index = this.player.multiplierValues.indexOf(this.player.bet.multiplier);
                  if (index >= 0) {
                    this.player.multiplierIndex = this.player.multiplierValues.indexOf(this.player.bet.multiplier);
                  }
                } else if (this.context.isMultiplierDefaultLastIndex) {
                  this.player.multiplierIndex = this.player.multiplierValues.length - 1;
                }
                this.player.bet.multiplier = this.player.multiplierValues[this.player.multiplierIndex];
                if (this.context.fround === "1") {
                  let fround = x.value.freeGameInfo;
                  if (x.value.dailyFreeGameInfo) {
                    fround = x.value.dailyFreeGameInfo;
                  }
                  if (fround) {
                    this.player.fround = fround;
                    this.player.froundCount = fround.round;
                  }
                }
              }
              this.extraGetBetsSetting(x);
            } else {
              director.injector.map("gameState").toValue(x);
              this.player.symbols = x.wheels;
              this.player.betValues = x.betValues;
              this.player.multiplierValues = x.multiplier;
              this.player.bet.amount = arr.first(x.betValues) as number;
              this.player.setDefaultBet();
              this.player.betValue = x.bet;
              this.player.demo = x.demo;
              this.player.getBet = x.data;
              this.player.multiplierIndex = 0;
              if (this.context.isMultiplierDefaultLastIndex) {
                this.player.multiplierIndex = this.player.multiplierValues.length - 1;
              }
              this.player.bet.multiplier = this.player.multiplierValues[this.player.multiplierIndex];
              if (this.context.fround === "1") {
                this.player.fround = x.fround;
                this.player.froundCount = x.froundCount;
              }
              if (x.bonus) {
                this.player.bonus = x.bonus;
                this.player.restoreBonus = true;
              }
            }
          }),
          this.netService
            .jackpot()
            .then((x) => {
              if (x.value && x.value.pool) {
                this.player.progressiveJackpot = x.value.pool;
              } else {
                this.context["isProgressiveJackpot"] = "false";
              }
            })
            .catch((err) => {
              this.context["isProgressiveJackpot"] = "false";
            })
        ])
      )
      .then(() => director.sceneManager.replace("splash"))
      .catch((err) => {
        if (err.code) {
          slotApp.showTranslateErr(err.code, true);
        } else {
          slotApp.showTranslateErr(err.error ? err.error : "0", true);
        }
      });
  }

  protected extraGetBetsSetting(rsp) {
    // for specific game bet settings from getBets
    // game code MUST override from LoginScene parent
    // to keep all games inherited up-to-date should parent be updated
    // receives response data in case some special handling is needed
  }

  exit() {
    super.exit();
    director.juggler.remove(this);
  }

  advanceTime(elapsedFrames: number): boolean {
    this.circle.rotation += 0.2;
    return true;
  }
}
