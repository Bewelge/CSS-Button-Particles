import { UI } from "./UI.js"
import { generateAndAppendCss, getCssGenerator } from "./CssGenerator.js"
import {
	addResetCallback,
	getSetting,
	initSettingDependencies,
	setCallbackIf,
	setGeneralSettingCallback,
	setSettingCallback
} from "./Settings.js"
import { paramsFromSettings, ShapeCreator } from "./ShapeCreator.js"
import { SETTING_IDS } from "./DefaultSettings.js"

var keyframes = []
let keyframeAmount = getSetting(SETTING_IDS.KEYFRAME_AMOUNT)
for (let i = 0; i <= keyframeAmount; i++) [keyframes.push(i / keyframeAmount)]

var shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
getCssGenerator().setData(keyframes, shapes)
generateAndAppendCss()

setGeneralSettingCallback(() => generateAndAppendCss())
addResetCallback(() => {
	getCssGenerator().setData(keyframes, shapes)
	generateAndAppendCss()
})
setCallbackIf(
	setting => setting.recreateCss,
	() => {
		keyframes = []
		let keyframeAmount = getSetting(SETTING_IDS.KEYFRAME_AMOUNT)
		for (let i = 0; i <= keyframeAmount; i++) {
			keyframes.push(i / keyframeAmount)
		}
		shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
		getCssGenerator().setData(keyframes, shapes)
		generateAndAppendCss()
	}
)
new UI()
initSettingDependencies()
// setSettingCallback(SETTING_IDS.BG_WIDTH)
