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

sort settings
seperate background image string box
- add header tabs 
	- 	github
	-	settings
	-	How to
	- 	About
- maybe only save the non-default values. Would break saved buttons on changing defaults though.
- allow expansion of button preview div.
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
