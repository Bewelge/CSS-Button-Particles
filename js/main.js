import { UI } from "./UI/UI.js"
import { generateAndAppendCss, getCssGenerator } from "./CssGenerator.js"
import {
	addResetCallback,
	addLoadCallback,
	getSetting,
	initSettingDependencies,
	setCallbackIf as setSettingCallbackIf,
	setGeneralSettingCallback,
	getSettingObject
} from "./Settings/Settings.js"
import { getShapesFromSettings, paramsFromSettings } from "./ShapeCreator.js"
import { SETTING_IDS } from "./Settings/DefaultSettings.js"
import { getKeyframes } from "./Keyframes.js"
/*
//TODOS:
- add header tabs 
	-	settings
	-	How to
	- 	About
- maybe only save the non-default values. Would break saved buttons on changing defaults though.
- allow expansion of button preview div.
- allow multiple shapes? How to handle the save/share functions then..
- 
*/

var keyframes = []
var shapes = []
refresh()

setGeneralSettingCallback(() =>
	generateAndAppendCss("theButton", getSettingObject(), true)
)
addResetCallback(() => {
	refresh()
})
addLoadCallback(() => {
	refresh()
})
setSettingCallbackIf(
	setting => setting.recreateCss,
	() => {
		refresh()
	}
)

new UI()
initSettingDependencies()

function refresh() {
	keyframes = getKeyframes(getSetting(SETTING_IDS.KEYFRAME_AMOUNT))

	shapes = getShapesFromSettings(keyframes, paramsFromSettings())
	getCssGenerator().setData(keyframes, shapes)
	generateAndAppendCss("theButton", getSettingObject(), true)
}
