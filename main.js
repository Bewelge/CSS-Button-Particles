import { UI } from "./UI.js"
import { CssGenerator } from "./CssGenerator.js"
import {
	getSetting,
	setCallbackIf,
	setGeneralSettingCallback,
	setSettingCallback
} from "./Settings.js"
import { paramsFromSettings, ShapeCreator } from "./ShapeCreator.js"
import { SETTING_IDS } from "./DefaultSettings.js"

var buttonRadius = 45
var keyframes = []
let keyframeAmount = getSetting(SETTING_IDS.KEYFRAME_AMOUNT)
for (let i = 0; i <= keyframeAmount; i++) [keyframes.push(i / keyframeAmount)]

var shapes = [new ShapeCreator(keyframes)]

new UI()
shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
let cssGen = new CssGenerator(keyframes, shapes)
cssGen.generateCss().appendStyleTagToBody()

setGeneralSettingCallback(() => cssGen.generateCss().appendStyleTagToBody())
setCallbackIf(
	setting => setting.recreateCss,
	() => {
		shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
		cssGen = new CssGenerator(keyframes, shapes)
		cssGen.generateCss().appendStyleTagToBody()
	}
)
// setSettingCallback(SETTING_IDS.BG_WIDTH)
