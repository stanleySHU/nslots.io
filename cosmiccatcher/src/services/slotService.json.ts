import { Register } from "../../engine/src/core/registry";
import * as director from "../../engine/src/director";
import { SlotService as _SlotService } from "../../engine/src/slotMachine/net/slotService.json";
import { tracker } from "../../engine/src/tracking/tracker";
import * as http from "./http";

@Register({ tag: "netService", category: "service" })
export class SlotService extends _SlotService {
  doubleUp(isLow: boolean) {
    const url = `${this.service}Game/BonusGame?game=${this.appContext.ID}&key=${this.player.sessionKey}&params=${isLow ? "1" : "0"}`;
    return this.send<any>(url);
  }

  collectDoubleUp() {
    const url = `${this.service}Game/CollectDoubleUp?game=${this.appContext.ID}&key=${this.player.sessionKey}`;
    return this.send<any>(url);
  }

  spin<T>(data?: any) {
    this.refreshTicket();
    const platform = director.device.platform;
    const url = `${this.service}Game/Spin`;
    const url2 = url + "?ts=" + this.ticket;

    tracker.request({
      id: this.ticket,
      url: url2,
      method: "POST"
    });

    const args = {
      game: this.appContext.ID,
      key: this.player.sessionKey,
      bet: this.player.totalBet.toNumber(),
      odds: data,
      platform: platform
    };

    const cheat = this.player.cheat || this.appContext.CHEAT;
    if (cheat) {
      args["cheat"] = cheat;
    }

    return new Promise<T>((resolve, reject) => {
      http
        .post(url, args, false, false)
        .then((x) => x.responseText)
        .then((response) => {
          const data = JSON.parse(response);
          if (data) {
            tracker.response({
              requestID: this.ticket,
              data: data
            });
            if (data.isError) {
              reject({ code: data.error, message: "" });
            } else {
              resolve(data as T);
            }
          } else {
            reject({ code: 0, message: "Unexpected Error" }); //default error handler
          }
        })
        .catch((err) => {
          reject({ code: 0, message: "Unexpected Error" }); //default error handler
        });
    });
  }
}
