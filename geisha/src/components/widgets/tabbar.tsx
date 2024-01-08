import { Layer, Orientation } from "common/components/layer";
import { SpriteAtlas } from "common/components/sprite";
import { GameStatusModel } from "../status/type";
import { Button, SButton, SPressButton } from "common/components/button";
import { Label, LabelLang } from "common/components/text";
import { TweenAmountLabel } from "common/components/tweenAnimations";
import { toCommaAndFixed } from "common/util/amount";
import { action_setBetAmount } from "common/model/spin";
import { useEffect, useRef, useState } from "react";
import { SlotContext } from "common/model/context";
import { I_RESIZE } from 'common/services/layoutService'
import { Container, utils } from "pixi.js";
import { Spin } from "./spin";
import { action_menuOpen } from "common/model/setting";
import { Selecter } from "./selecter";
import { atLast } from "common/util/array";


export function TabBar({ dataSource }: { dataSource: GameStatusModel }) {
    const { state, dispatch, gameStatus } = dataSource.base!;
    const { menuOn } = state.setting;
    const { currency } = state.user;
    const { betLevel, betAmount, lineBetsModel } = state.spin;
    const [selecterOn, setSelecterOn] = useState(false);
    const { lineBets } = state.spin.lineBetsModel!;
    const tabbar = useRef<Container>(null);
    const menuP = useRef<Container>(null);
    const slotContext = SlotContext.Obj;
    const isMobile = utils.isMobile.any;
    const isIdle = gameStatus == 'idle';
    const isAutoSpin = state.spin.autoSpinCount == '∞' || state.spin.autoSpinCount > 0;

    function onAdd() {
        const index = lineBets.indexOf(betAmount.toFixed(2)) + 1;
        if (index < lineBets.length) {
            dispatch(action_setBetAmount(lineBets[index]));
        }
    }

    function onMinus() {
        const index = lineBets.indexOf(betAmount.toFixed(2)) - 1;
        if (index >= 0) {
            dispatch(action_setBetAmount(lineBets[index]));
        }
    }

    function onMenu() {
        dispatch(action_menuOpen(!menuOn));
    }

    useEffect(() => {
        if (tabbar.current, menuP.current) {
            const func = () => {
                const [left, top, width, height] = slotContext.viewport;
                const orientation = slotContext.orientation;
                let { displayArea: [displaLeft, displayTop, displayWidth, displayHeight], safeArea } = slotContext.layoutOptions;
                tabbar.current!.y = height - top + displayTop;
                if (orientation == 'l') {
                } else {
                    menuP.current!.position.set(-left + 50 + displaLeft, -top + 50 + displayTop);
                }
            }
            func();
            slotContext.notice.on(I_RESIZE, func);
            return () => {
                slotContext.notice.off(I_RESIZE, func);
            }
        }
    }, [tabbar]);

    const enableMin = isIdle && !isAutoSpin && betAmount.toNumber() != Number(lineBetsModel!.lineBets[0]);
    const enableMax = isIdle && !isAutoSpin && betAmount.toNumber() != Number(atLast(lineBetsModel!.lineBets))

    return (
        <Layer>
            <Orientation>
                <Layer l-x={585} p-x={585} l-pivot={[585, 117]} p-pivot={[585, 82]} ref={tabbar}>
                    <SpriteAtlas name={"UI_Container.png"} l-y={0} p-y={-160}></SpriteAtlas>
                    <SpriteAtlas name={"value_bg.png"} l-y={57} p-y={37}></SpriteAtlas>
                    <SButton interactive={isIdle && !isAutoSpin} l-x={50} l-y={73} p-x={330} p-y={-97} l-visible={true} p-visible={true} click={onMenu}>
                        <SpriteAtlas name={"menu-on.png"} anchor={0.5} tint={isIdle && !isAutoSpin ? 0xffffff : 0x888888}></SpriteAtlas>
                    </SButton>
                    <Layer l-x={280} l-y={35} p-x={383} p-y={15}>
                        <Layer x={0}>
                            <LabelLang anchor={0.5} text={'balance'} style={{
                                fill: '#eeeeee', fontFamily: 'Figtree', fontWeight: '500',
                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                            }}></LabelLang>
                            <Layer y={37}>
                                <TweenAmountLabel anchor={0.5} tmp={`${currency} {}`} maxScaleLength={190} text={state.user.balance.toNumber()} tweenOptions={{duration: 500}} style={{
                                    fontSize: 26, fill: '#eeeeee', fontFamily: 'Figtree',
                                    dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                                }}></TweenAmountLabel>
                            </Layer>
                        </Layer>
                        <Layer l-x={250} l-y={-15} p-x={202} p-y={-15}>
                            {
                                isMobile ? <Layer>
                                    <Button y={52} interactive={isIdle && !isAutoSpin} click={setSelecterOn.bind(null, true)}>
                                        <SpriteAtlas name={"bet_amount_bg.png"} anchor={0.5} tint={isIdle && !isAutoSpin ? 0xffffff : 0x888888}></SpriteAtlas>
                                        <Label anchor={0.5} y={-2} text={toCommaAndFixed(betAmount)} style={{
                                            fill: '#fcaf00', fontFamily: 'Figtree', fontWeight: '500',
                                            dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                                        }}></Label>
                                    </Button>
                                </Layer> :
                                    <Layer>
                                        <Layer y={52}>
                                            <Label anchor={0.5} y={-2} text={`${toCommaAndFixed(betAmount)}`} style={{
                                                fill: '#fcaf00', fontFamily: 'Figtree', fontWeight: '500',
                                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                                            }}></Label>
                                        </Layer>
                                        <Layer y={53}>
                                            <SButton l-x={-95} p-x={-75} click={onMinus} interactive={enableMin}>
                                                <SpriteAtlas name={"bet_minus.png"} anchor={0.5} tint={enableMin ? 0xffffff : 0x888888}></SpriteAtlas>
                                            </SButton>
                                            <SButton l-x={95} p-x={75} click={onAdd} interactive={enableMax}>
                                                <SpriteAtlas name={"bet_plus.png"} anchor={0.5} tint={enableMax ? 0xffffff : 0x888888}></SpriteAtlas>
                                            </SButton>
                                        </Layer>
                                    </Layer>
                            }
                            <LabelLang l-y={5} p-y={0} anchor={0.5} text={'betamount'} style={{
                                fill: '#fcaf00', fontFamily: 'Figtree', fontWeight: '500',
                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                            }}></LabelLang>
                        </Layer>
                        <Layer l-x={500} p-x={404}>
                            <LabelLang anchor={0.5} text={'totalbet'} style={{
                                fill: '#eeeeee', fontFamily: 'Figtree', fontWeight: '500',
                                dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                            }}></LabelLang>
                            <Layer y={37}>
                                <TweenAmountLabel anchor={0.5} tmp={`${currency} {}`} maxScaleLength={190} text={betLevel?.mul(betAmount)} style={{
                                    fontSize: 26, fill: '#eeeeee', fontFamily: 'Figtree',
                                    dropShadow: true, dropShadowColor: '#000000', dropShadowBlur: 2, dropShadowAngle: Math.PI / 6, dropShadowDistance: 2
                                }}></TweenAmountLabel>
                            </Layer>
                        </Layer>
                    </Layer>
                    <Layer>
                        <Spin dataSource={dataSource}></Spin>
                    </Layer>
                </Layer>
                <Button ref={menuP} l-visible={false} p-visible={false} click={onMenu}>
                    <SpriteAtlas name={"menu-on.png"} anchor={0.5}></SpriteAtlas>
                </Button>
            </Orientation>
            <Selecter on={selecterOn} onClose={setSelecterOn.bind(null, false)} lineBets={lineBets} onSelectedChange={(i) => { dispatch(action_setBetAmount(lineBets[i])) }}></Selecter>
        </Layer>
    )
}
