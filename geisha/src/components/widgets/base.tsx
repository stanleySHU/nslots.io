import { R_Spine_All, R_Spine_Number, R_Spine_spin } from "@/assets";
import { SpineCount, SpineStaticHOC, Spine } from "common/components/Spine";
import { SlotContext } from "common/model/context";
import { Languages } from "common/model/context/baseContext";
import { ComponentProps } from "react";


export type I_Spine_All = 'WILD_WIN' | 'WILD_IDLE' | 'SCATTER_WIN' | 'SCATTER_IDLE' | 'LP_Q_WIN' | 'LP_K_WIN' | 'LP_J_WIN' | 'LP_A_WIN' | 'LP_10_WIN' | 
'HP_Umbrella_WIN' | 'HP_Slipper_WIN' | 'HP_Mask_WIN' | 'HP_Geisha_IDLE' | 'GEISHA_IDLE' | 'HP_Geisha_WIN' | 'HP_FAN_WIN' |
'BIGWIN_OUT' | 'BIGWIN_IDLE' | 'BIGWIN_ENTER' | '5ofakind_OUT' | '5ofakind_IDLE' | '5ofakind_ENTER';
export type I_Spine_Number= 'MultiplierWin' | 'WinInfo';
export type I_Spine_Number_Skin = 'x1' | 'x5' | 'x10' | 'x100' | 'x2' | 'x20';
export type I_Spine_Spin = 'Auto' | 'Idle';

export const Spine_All = SpineStaticHOC<ComponentProps<typeof SpineCount>, I_Spine_All, 'EN' | 'CH' >(SpineCount, R_Spine_All, {skin: SlotContext.Obj.urlOptions.lang == Languages.Chinese ? 'CH' : 'EN'});
export const Spine_Number = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Number, I_Spine_Number_Skin >(Spine, R_Spine_Number);
export const Spine_Spin = SpineStaticHOC<ComponentProps<typeof Spine>, I_Spine_Spin >(Spine, R_Spine_spin);


