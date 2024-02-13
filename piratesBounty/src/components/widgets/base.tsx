import { R_Spine_BossShip, R_Spine_Cannon, R_Spine_Fog, R_Spine_Grates, R_Spine_SeaBg, R_Spine_Boat, R_Spine_Explosion, R_Spine_Victory_Screen, R_Spine_BOSSWARNING, R_Spine_TitleScreen, R_Spine_HYPER, R_Spine_ShipCannon, R_Spine_ShieldFinal, R_Mascot, R_Star, R_Spine_Speech, R_Spine_BossShipRear, R_Spine_Banner1, R_Spine_Banner2, R_Spine_Banner3, R_Spine_Banner4, R_Spine_Banner5, R_Explosion, R_FireIdle, R_Splash, R_Spine_BossFightText, R_Gear, R_CannonFire, R_Coins, R_Spine_PopUp, R_Heal } from "@/assets";
import { R_Components } from "common/assets";
import { Spine, SpineCount, SpineStaticHOC } from "common/components/Spine";
import { AnimatedSheet, AnimatedSheetCount, AnimatedSheetStaticHOC } from "common/components/animatedsprite";
import { ComponentProps } from "react";

export type ISpine_Cannon = 'GOLD2cannon_idle0' | 'GOLD3cannon_idle0' | 'MDGOLD2cannoncombine0' | 'MDGOLD2cannonsshoot0' | 'MDGOLD2cannons_disassemble0' | 'MDGOLD3cannoncombine0' |
                            'MDGOLD3cannonsshoot0' | 'MDGOLD3cannons_disassemble0' | 'MDNORMAL2cannoncombine0' | 'MDNORMAL2cannonsshoot0' | 'MDNORMAL2cannons_disassemble0' |
                            'MDNORMAL3cannoncombine0' | 'MDNORMAL3cannonsshoot0' | 'MDNORMAL3cannons_disassemble0' | 'NORMAL2cannon_idle0' | 'NORMAL3cannon_idle0';
export type ISpine_SeaBg = 'GhostLoop' | 'MorningLoop' | 'MorningMob' | 'MorningToSunset' | 'NightLoop' | 'NightToGhost' | 'SunsetLoop';
export type ISpine_Grates = 'Grates_Gold_3_to_5' | 'Grates_Gold_5_to_3' | 'Grates_Gold_Idle 5slot' | 'Grates_Gold_ Ilde 3slot' | 'Grates_Gold_ Open' | 'Grates_Normal_ 3_to_5' | 'Grates_Normal_ 5_to_3' | 'Grates_Normal_Idle 3slot' | 'Grates_Normal_ Ilde 5slot' | 'Grates_Normal_ Open';
export type ISpine_FOG = 'FOG_IN' | 'FOG_OUT' | 'FOG_Idle';
export type ISpine_BossShip = 'destroyed' | 'Enter' | 'Hit' | 'Hit2' | 'Ilde' | 'Reaload' | 'Exit';
export type ISpine_ShipCannon = 'Fire' | 'Idle to Ready' | 'Ilde' | 'Ready' | 'Ready to Idle' | 'Reaload'; 
export type ISpine_Boat = 'Lv1boat_left' | 'Lv1boat_mid' | 'Lv1boat_right' | 'Lv1boat_left1' | 'Lv1boat_mid1' | 'Lv1boat_right1' | 'Lv1boat_left2' | 'Lv1boat_mid2' | 'Lv1boat_right2' | 
                            'Lv2boat_left' | 'Lv2boat_mid' | 'Lv2boat_right' | 'Lv2boat_left1' | 'Lv2boat_mid1' | 'Lv2boat_right1' | 'Lv2boat_left2' | 'Lv2boat_mid2' | 'Lv2boat_right2' | 
                            'Lv3boat_left' | 'Lv3boat_mid' | 'Lv3boat_right' | 'Lv3boat_left1' | 'Lv3boat_mid1' | 'Lv3boat_right1' | 'Lv3boat_left2' | 'Lv3boat_mid2' | 'Lv3boat_right2' | 
                            'Lv4boat_left' | 'Lv4boat_mid' | 'Lv4boat_right' | 'Lv4boat_left1' | 'Lv4boat_mid1' | 'Lv4boat_right1' | 'Lv4boat_left2' | 'Lv4boat_mid2' | 'Lv4boat_right2' | 
                            'Lv5boat_left' | 'Lv5boat_mid' | 'Lv5boat_right' | 'Lv5boat_left1' | 'Lv5boat_mid1' | 'Lv5boat_right1' | 'Lv5boat_left2' | 'Lv5boat_mid2' | 'Lv5boat_right2';
export type ISpine_Wave = 'animation';
export type ISpine_Explosion = 'Large' | 'Medium' | 'Normal' | 'Small';
export type ISpine_Victory_Screen = 'Victory_Map_Knife';
export type ISpine_Bosswarning = 'bosswarning_L' | 'bosswarning_R';
export type ISpine_Title_Screen = 'Idle 2' | 'Ilde 1';
export type ISpine_Hyper = 'freegame' | 'freegamehyper' | 'freegame_smallUI2' | 'hyper_normal' | 'hyper_rainbow' | 'hyper_rainbow_smallUI';
export type ISpine_Squid = 'Enter_gold' | 'Enter_normal' | 'Exit_gold' | 'Exit_normal' | 'Idle_gold' | 'Idle_normal';
export type ISpine_ShieldFinal = 'Splash_Big' | 'Splash_Normal' |
'Level 5_Activate' | 'Level 5_Activate_Curtain_Torch' | 'Level 5_Destroyed' | 'Level 5_Destroyed_Curtain_Torch' | 'Level 5_Empty' | 'Level 5_Empty_Curtain_Torch' | 'Level 5_Idle' | 
                                    'Level 5_Idle_Curtain_Torch' | 'Level 5_Low HP' | 'Level 5_Low HP_Curtain_Torch' | 'Plain_Activate' | 'Plain_Activate_Curtain_Torch' | 'Plain_Destroyed' | 'Plain_Destroyed_Curtain_Torch'
                                    | 'Plain_Empty' | 'Plain_Empty_Curtain_Torch' | 'Plain_Idle' | 'Plain_Idle_Curtain_Torch' | 'Plain_Low HP' | 'Plain_Low HP_Curtain_Torch';
export type ISpine_Speech=  '!! Bubble' | '! Bubble' | 'Cloud 1' | 'Cloud 2' | 'Cloud 3' | 'Cloud 4' | 'Cloud 5' | 'Poly 1' | 'Poly 2';;
export type ISpine_BossShipRear = 'Idle' | 'Idle Night' | 'Idle Sunset' | 'out' | 'Out Night' | 'Out Sunset' | 'Idle Hit' | 'Idle Night Hit' | 'Idle Sunset Hit';
export type I_Spine_BoatSplash = 'animation';
export type I_Spine_Banner1 = 'Banner1';
export type I_Spine_Banner2 = 'Banner 2';
export type I_Spine_Banner3 = 'Banner 3';
export type I_Spine_Banner4 = 'Banner 4';
export type I_Spine_Banner5 = 'Banner 5';
export type I_Spine_BossFightText = 'chase_enter' | 'chase_idle' | 'destroy_enter' | 'destroy_idle';
export type I_Spine_PopUp = 'Intro';

export const Spine_CannonCount = SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_Cannon>(SpineCount, R_Spine_Cannon);
export const Spine_SeaBg = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_SeaBg>(Spine, R_Spine_SeaBg);
export const Spine_Grates = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Grates>(Spine, R_Spine_Grates);
export const SpineCount_Fog = SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_FOG>(SpineCount, R_Spine_Fog);
export const SpineCount_BossShip = SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_BossShip>(SpineCount, R_Spine_BossShip);
export const SpineCount_ShipCannon= SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_ShipCannon>(SpineCount, R_Spine_ShipCannon);
export const Spine_Boat = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Boat>(Spine, R_Spine_Boat);
export const SpineCount_Explosion = SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_Explosion>(SpineCount, R_Spine_Explosion);
export const SpineCount_VictoryScreen = SpineStaticHOC<ComponentProps<typeof SpineCount>, ISpine_Victory_Screen>(SpineCount, R_Spine_Victory_Screen);
export const Spine_Bosswarning = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Bosswarning>(Spine, R_Spine_BOSSWARNING);
export const Spine_Title_Screen = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Title_Screen>(Spine, R_Spine_TitleScreen);
export const Spine_Hyper = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Hyper>(Spine, R_Spine_HYPER);
export const Spine_ShieldFinal = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_ShieldFinal>(Spine, R_Spine_ShieldFinal);
export const Spine_Speech = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_Speech>(Spine, R_Spine_Speech);
export const Spine_BossShipRear = SpineStaticHOC<ComponentProps<typeof Spine>, ISpine_BossShipRear>(Spine, R_Spine_BossShipRear);
export const Spine_Banner1 = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Banner1>(Spine, R_Spine_Banner1);
export const Spine_Banner2 = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Banner2>(Spine, R_Spine_Banner2);
export const Spine_Banner3 = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Banner3>(Spine, R_Spine_Banner3);
export const Spine_Banner4 = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Banner4>(Spine, R_Spine_Banner4);
export const Spine_Banner5 = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Banner5>(Spine, R_Spine_Banner5);
export const Spine_BossFightText = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_BossFightText>(Spine, R_Spine_BossFightText);
export const Spine_PopUp = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_PopUp>(Spine, R_Spine_PopUp);


export const AnimatedSheet_Gear = AnimatedSheetStaticHOC(AnimatedSheet, R_Components, 'Nrml_Gear', 0.3);
export const AnimatedSheet_Arrows_Left = AnimatedSheetStaticHOC(AnimatedSheet, R_Components, 'Gold_Arrows_Left', 0.3);
export const AnimatedSheet_Arrows_Right = AnimatedSheetStaticHOC(AnimatedSheet, R_Components, 'Gold_Arrows_Right', 0.3);
export const AnimatedSheet_GlowArrows = AnimatedSheetStaticHOC(AnimatedSheet, R_Components, 'Gold_GlowArrows', 0.3);

export const AnimatedSheet_Cheer = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Cheer', 0.3);
export const AnimatedSheet_Idle = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Idle', 0.3);
export const AnimatedSheet_Jump = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Jump', 0.3);
export const AnimatedSheet_Shocked = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Shocked', 0.3);
export const AnimatedSheet_Sword = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Sword', 0.3);
export const AnimatedSheet_Telescope = AnimatedSheetStaticHOC(AnimatedSheet, R_Mascot, 'Crocodile_Telescope', 0.3);
export const AnimatedSheet_StarY = AnimatedSheetStaticHOC(AnimatedSheet, R_Star, 'Yellow_Star', 0.3);
export const AnimatedSheet_StarB = AnimatedSheetStaticHOC(AnimatedSheet, R_Star, 'Blue_Star', 0.3);
export const AnimatedSheet_StarG = AnimatedSheetStaticHOC(AnimatedSheet, R_Star, 'Green_Star', 0.3);
export const AnimatedSheet_Splash = AnimatedSheetStaticHOC(AnimatedSheet, R_Splash, 'splash', 0.3);

export const AnimatedSheetCount_Explosion = AnimatedSheetStaticHOC(AnimatedSheetCount, R_Explosion, 'explosion', 0.5);
export const AnimatedSheet_FireIdle = AnimatedSheetStaticHOC(AnimatedSheet, R_FireIdle, 'fireIdle', 0.33);

export const AnimatedSheet_GearFire = AnimatedSheetStaticHOC(AnimatedSheet, R_Gear, 'gears_fire', 0.33);
export const AnimatedSheet_CannonFire = AnimatedSheetStaticHOC(AnimatedSheet, R_CannonFire, 'cannon_fire', 0.33);
export const AnimatedSheet_Coins = AnimatedSheetStaticHOC(AnimatedSheet, R_Coins, 'gpiCoins', 1);
export const AnimatedSheet_Heal = AnimatedSheetStaticHOC(AnimatedSheetCount, R_Heal, 'bossHeal_fx', 1);

{/* <SpriteAtlas x={15} anchor={0.5} res={R_Gear} name={`gears_fire_${_frame0}.png`}></SpriteAtlas> */}
