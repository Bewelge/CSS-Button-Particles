import { UI } from "./UI.js"
import { CssGenerator } from "./CssGenerator.js"
import {
	getSetting,
	setCallbackIf,
	setGeneralSettingCallback,
	setSetting
} from "./Settings.js"
import { paramsFromSettings, ShapeCreator } from "./ShapeCreator.js"

var buttonRadius = 45
var keyframes = []
let keyframeAmount = 5
for (let i = 0; i <= keyframeAmount; i++) [keyframes.push(i / keyframeAmount)]

var shapes = [
	// new Shape("circle", {
	// 	positions: [
	// 		[0, 0],
	// 		[150, 150]
	// 	],
	// 	sizes: [
	// 		[50, 50],
	// 		[50, 50]
	// 	],
	// 	color: "black"
	// }),
	// new Shape("circle", {
	// 	positions: [
	// 		[0, 0],
	// 		[150 - 12.5, 150 - 12.5]
	// 	],
	// 	sizes: [
	// 		[25, 25],
	// 		[25, 25]
	// 	],
	// 	color: "black"
	// })
]

// shapes.push(
// 	new Shape("circle", {
// 		positions: keyframes.map(keyframe => [50, 50]),
// 		sizes: keyframes.map(keyframe => [
// 			100 + Math.pow(1 + keyframe * 5, 5) * 10,
// 			100 + Math.pow(1 + keyframe * 5, 5) * 10
// 		]),
// 		color: "rgba(0,0,0,0.5)"
// 	})
// )

new UI()
shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
let cssGen = new CssGenerator(keyframes, shapes)
cssGen.generateCss().appendStyleTagToBody()
// generateCssString()

// setSetting("particleAmount", 100)

setGeneralSettingCallback(() => cssGen.generateCss().appendStyleTagToBody())
setCallbackIf(
	setting => setting.recreateShapes,
	() => {
		shapes = new ShapeCreator(keyframes, paramsFromSettings()).create()
		cssGen = new CssGenerator(keyframes, shapes)
		cssGen.generateCss().appendStyleTagToBody()
	}
)

// generateCssString()

// function getInit

function drawOnCanvas() {}
