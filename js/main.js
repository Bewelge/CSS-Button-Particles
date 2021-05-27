import { UI } from "./UI/UI.js"
import { generateAndAppendCss, getCssGenerator } from "./CssGenerator.js"
import {
	addResetCallback,
	addLoadCallback,
	getSetting,
	initSettingDependencies,
	setCallbackIf as setSettingCallbackIf,
	setGeneralSettingCallback
} from "./Settings/Settings.js"
import { paramsFromSettings, ShapeCreator } from "./ShapeCreator.js"
import { SETTING_IDS } from "./Settings/DefaultSettings.js"
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

setGeneralSettingCallback(() => generateAndAppendCss())
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
	keyframes = []
	let keyframeAmount = getSetting(SETTING_IDS.KEYFRAME_AMOUNT)
	for (let i = 0; i <= keyframeAmount; i++) {
		keyframes.push(i / keyframeAmount)
	}
	shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
	getCssGenerator().setData(keyframes, shapes)
	generateAndAppendCss()
}
