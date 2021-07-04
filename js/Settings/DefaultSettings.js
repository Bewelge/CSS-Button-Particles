import { SHAPE_TYPES } from "../CssShapes.js"
import { setSetting } from "./Settings.js"
import { getCssVariable } from "../Util/Util.js"

export const getDefaultSettings = () => {
	let copy = {}
	for (let tab in defaultSettings) {
		copy[tab] = {}
		for (let category in defaultSettings[tab]) {
			copy[tab][category] = []
			defaultSettings[tab][category].forEach(setting => {
				let settingCopy = {}
				for (let attribute in setting) {
					settingCopy[attribute] = setting[attribute]
				}
				copy[tab][category].push(settingCopy)
			})
		}
	}
	return copy
}
export const getADefaultSetting = settingId => {
	let setting = null
	Object.keys(defaultSettings).forEach(tab =>
		Object.keys(defaultSettings[tab]).forEach(cat =>
			defaultSettings[tab][cat].forEach(aSetting => {
				if (aSetting.id == settingId) {
					setting = aSetting
				}
			})
		)
	)
	return setting
}
export const SETTING_TYPES = {
	LIST: "list",
	SLIDER: "slider",
	CHECKBOX: "checkbox",
	COLOR: "color",
	CSS_COLOR: "cssColor",
	CSS_NUMBER: "cssNum",
	DOUBLE_SLIDER: "doubleSlider",
	TEXT_INPUT: "textInput",
	TEXT_AREA: "textArea"
}
export const SETTING_IDS = {
	//Css animation
	ANIMATION_DURATION: "animationDuration",
	KEYFRAME_AMOUNT: "keyframes",
	SEED: "seed",

	//Shape
	SHAPE_TYPE: "shape",
	SHAPE_STRING: "shapeStr",
	//Particles
	PARTICLE_AMOUNT: "particleAmount",
	SIZE_MULTIPLIER: "sizeChange",
	SIZE_ADDER: "sizeChangeAdd",
	PARTICLE_COLOR: "partCol",
	ROTATION_CHANGE: "rotChange",
	//Particle starting vals
	START_SIZE: "startSiz",
	ANGLE_SPREAD_EVENLY: "anglSprd",
	SPAWN_ANGLE: "spawnAngle",
	START_ANGLE: "startAngle",
	START_RADIUS: "startRad",
	START_SPEED: "spd",

	//physics
	SIMULATIONS_PER_KEYFRAME: "simsPerKeyframe",
	GRAVITY: "grav",
	GRAVITY_TOWARDS_BUTTON: "gravToBtn",
	FRICTION: "fric",
	THRUST: "thrust",
	ANGULAR_FRICTION: "angFric",

	//button
	BUTTON_WIDTH: "btnWd",
	BUTTON_HEIGHT: "btnHt",
	BG_WIDTH: "bgW",
	BG_HEIGHT: "bgH",
	BUTTON_BORDER_RADIUS: "btnBordRad",
	BG_COLOR: "buttonColor0",
	BTN_COLOR_1: "buttonColor1",
	BTN_COLOR_2: "buttonColor2",
	BTN_FONT_COLOR: "buttonFontColor",
	BTN_FONT_SIZE: "buttonFontSize",

	TRANSFORM_ROTATE_Z: "transRotZ",
	TRANSFORM_ROTATE_X: "transRotX",
	TRANSFORM_ROTATE_Y: "transRotY",
	TRANSFORM_SCALE_X: "transScaX",
	TRANSFORM_SCALE_Y: "transScaY",
	TRANSFORM_SCALE_CONSTANT: "transScaConst",

	KEYFRAME_COMPACT: "keyCmpct",
	BG_IMG_COMPACT: "bgImgCmpct",
	COMPLETE_COMPACT: "cmplCmpct",
	BUTTON_NAME: "btnName"
}
const defaultSettings = {
	General: {
		"Css Animation": [
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.SEED,
				label: "Seed",
				value: 5000,
				min: 1,
				max: 10000,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.SEED, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.ANIMATION_DURATION,
				label: "Animation duration (s)",
				value: 0.8,
				min: 0.05,
				max: 60,
				step: 0.05,
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.ANIMATION_DURATION, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.KEYFRAME_AMOUNT,
				label: "Keyframe amount",
				value: 30,
				min: 2,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.KEYFRAME_AMOUNT, value)
			}
		],

		Particles: [
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.PARTICLE_AMOUNT,
				label: "Particle amount",
				value: 20,
				min: 1,
				max: 250,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.PARTICLE_AMOUNT, value)
			},
			{
				type: SETTING_TYPES.LIST,
				id: SETTING_IDS.SHAPE_TYPE,
				label: "Shape",
				value: SHAPE_TYPES.CIRCLE,
				list: Object.keys(SHAPE_TYPES).map(key => SHAPE_TYPES[key]),
				recreateCss: true,
				onChange: val => setSetting(SETTING_IDS.SHAPE_TYPE, val),
				subSettings: []
			},
			{
				type: SETTING_TYPES.COLOR,
				showIfDependee: SETTING_IDS.SHAPE_TYPE,
				showIf: value => {
					return value != SHAPE_TYPES.CUSTOM
				},
				id: SETTING_IDS.PARTICLE_COLOR,
				label: "Particle color",
				value: "#f44336",
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.PARTICLE_COLOR, value)
			},
			{
				type: SETTING_TYPES.TEXT_AREA,
				showIfDependee: SETTING_IDS.SHAPE_TYPE,
				showIf: value => {
					return value == SHAPE_TYPES.CUSTOM
				},
				id: SETTING_IDS.SHAPE_STRING,
				label: "Custom shape string",
				value:
					"radial-gradient(circle, black  30%, transparent 35%, black 40%, transparent 45%, black 50%, transparent 55%)",
				update: () => {},
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.SHAPE_STRING, value)
			},

			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.START_SIZE,
				label: "Size",
				lowerValue: 15,
				upperValue: 70,
				min: 1,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_SIZE, [lower, upper])
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.SIZE_MULTIPLIER,
				label: "Size multiplier (per physics tick)",
				lowerValue: 0.99,
				upperValue: 0.999,
				min: 0.8,
				max: 1.2,
				step: 0.001,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.SIZE_MULTIPLIER, [lower, upper])
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.SIZE_ADDER,
				label: "Size change (+/- per physics tick)",
				lowerValue: 0,
				upperValue: 0,
				min: -1,
				max: 1,
				step: 0.01,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.SIZE_ADDER, [lower, upper])
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.SPAWN_ANGLE,
				label: "Starting position (angle from middle)",
				lowerValue: 0,
				upperValue: 360,
				min: 0,
				max: 360,
				step: 1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.SPAWN_ANGLE, [lower, upper])
			},
			{
				type: SETTING_TYPES.CHECKBOX,
				id: SETTING_IDS.ANGLE_SPREAD_EVENLY,
				label: "Spread start angle evenly",
				value: true,
				recreateCss: true,
				onChange: event =>
					setSetting(SETTING_IDS.ANGLE_SPREAD_EVENLY, event.target.checked)
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.START_ANGLE,
				label: "Starting direction (deg)",
				lowerValue: -15,
				upperValue: 15,
				min: -180,
				max: 180,
				step: 1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_ANGLE, [lower, upper])
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.ROTATION_CHANGE,
				label: "Direction change (deg / physics tick)",
				lowerValue: 0,
				upperValue: 0,
				min: -180,
				max: 180,
				step: 0.1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.ROTATION_CHANGE, [lower, upper])
			},

			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.START_RADIUS,
				label: "Starting Radius (from center of button)",
				lowerValue: 45,
				upperValue: 45,
				min: 0,
				max: 250,
				step: 1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_RADIUS, [lower, upper])
			}
		],
		Physics: [
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.SIMULATIONS_PER_KEYFRAME,
				label: "Physics ticks / keyframe",
				value: 25,
				min: 1,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value =>
					setSetting(SETTING_IDS.SIMULATIONS_PER_KEYFRAME, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.GRAVITY,
				label: "Gravity",
				value: 0,
				min: -100,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.GRAVITY, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.GRAVITY_TOWARDS_BUTTON,
				label: "Gravity towards button",
				value: 2,
				min: -100,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.GRAVITY_TOWARDS_BUTTON, value)
			},
			{
				type: SETTING_TYPES.DOUBLE_SLIDER,
				id: SETTING_IDS.START_SPEED,
				label: "Initial Speed",
				lowerValue: 4,
				upperValue: 5,
				min: 0,
				max: 100,
				step: 0.1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_SPEED, [lower, upper])
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.THRUST,
				label: "Thrust - constant accelaration",
				value: 0,
				min: 0,
				max: 1,
				step: 0.01,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.THRUST, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.FRICTION,
				label: "Friction",
				value: 0.03,
				min: 0,
				max: 0.4,
				step: 0.01,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.FRICTION, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.ANGULAR_FRICTION,
				label: "Angular friction",
				value: 0,
				min: 0,
				max: 1,
				step: 0.01,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.ANGULAR_FRICTION, value)
			}
		],

		Button: [
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.BUTTON_WIDTH,
				label: "Button Width",
				value: 90,
				min: 50,
				max: 300,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BUTTON_WIDTH, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.BUTTON_HEIGHT,
				label: "Button Height",
				value: 90,
				min: 50,
				max: 300,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BUTTON_HEIGHT, value)
			},
			{
				hidden: false,
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.BUTTON_BORDER_RADIUS,
				label: "Border Radius",
				value: 45,
				min: 0,
				max: 150,
				step: 1,
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BUTTON_BORDER_RADIUS, value)
			},
			{
				type: SETTING_TYPES.CSS_COLOR,
				id: SETTING_IDS.BG_COLOR,
				label: "Button background color",
				value: getCssVariable("buttonColor0"),
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BG_COLOR, value)
			},
			{
				type: SETTING_TYPES.CSS_COLOR,
				id: SETTING_IDS.BTN_COLOR_1,
				label: "Button outer stroke color",
				value: getCssVariable("buttonColor1"),
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BTN_COLOR_1, value)
			},
			{
				type: SETTING_TYPES.CSS_COLOR,
				id: SETTING_IDS.BTN_COLOR_2,
				label: "Button inner stroke color",
				value: getCssVariable("buttonColor2"),
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BTN_COLOR_2, value)
			},
			{
				type: SETTING_TYPES.CSS_COLOR,
				id: SETTING_IDS.BTN_FONT_COLOR,
				label: "Button font color",
				value: getCssVariable("buttonFontColor"),
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BTN_FONT_COLOR, value)
			},
			{
				type: SETTING_TYPES.CSS_NUMBER,
				suffix: "px",
				id: SETTING_IDS.BTN_FONT_SIZE,
				label: "Button font size",
				value: 16,
				min: 1,
				max: 200,
				step: 1,
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.BTN_FONT_SIZE, value)
			},
			{
				hidden: false,
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.BG_WIDTH,
				label: "Particle container Width",
				value: 1000,
				min: 50,
				max: 3600,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BG_WIDTH, value)
			},
			{
				hidden: false,
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.BG_HEIGHT,
				label: "Particle container Height",
				value: 1000,
				min: 50,
				max: 3600,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BG_HEIGHT, value)
			}
		],
		"Background Transforms": [
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_ROTATE_X,
				label: "X-Rotation change / keyframe",
				value: 0,
				min: -90,
				max: 90,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.TRANSFORM_ROTATE_X, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_ROTATE_Y,
				label: "Y-Rotation change / keyframe",
				value: 0,
				min: -90,
				max: 90,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.TRANSFORM_ROTATE_Y, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_ROTATE_Z,
				label: "Z-Rotation change / keyframe",
				value: 0,
				min: -90,
				max: 90,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.TRANSFORM_ROTATE_Z, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_SCALE_X,
				label: "Scale-X (% change / keyframe)",
				value: 0,
				min: -100,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.TRANSFORM_SCALE_X, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_SCALE_Y,
				label: "Scale-Y (% change / keyframe)",
				value: 0,
				min: -100,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.TRANSFORM_SCALE_Y, value)
			},
			{
				type: SETTING_TYPES.SLIDER,
				id: SETTING_IDS.TRANSFORM_SCALE_CONSTANT,
				label: "Constant scale  (%)",
				value: 100,
				min: -500,
				max: 500,
				step: 1,
				recreateCss: true,
				onChange: value =>
					setSetting(SETTING_IDS.TRANSFORM_SCALE_CONSTANT, value)
			}
		],
		Hidden: [
			{
				hidden: true,
				type: SETTING_TYPES.CHECKBOX,
				id: SETTING_IDS.BG_IMG_COMPACT,
				label: "Format",
				value: false,
				recreateCss: false,
				onChange: event =>
					setSetting(SETTING_IDS.BG_IMG_COMPACT, event.target.checked)
			},
			{
				hidden: true,
				type: SETTING_TYPES.CHECKBOX,
				id: SETTING_IDS.KEYFRAME_COMPACT,
				label: "Format",
				value: false,
				recreateCss: false,
				onChange: event =>
					setSetting(SETTING_IDS.KEYFRAME_COMPACT, event.target.checked)
			},
			{
				hidden: true,
				type: SETTING_TYPES.CHECKBOX,
				id: SETTING_IDS.COMPLETE_COMPACT,
				label: "Format",
				value: true,
				recreateCss: false,
				onChange: event =>
					setSetting(SETTING_IDS.COMPLETE_COMPACT, event.target.checked)
			},
			{
				hidden: true,
				type: SETTING_TYPES.TEXT_INPUT,
				id: SETTING_IDS.BUTTON_NAME,
				label: "Button name",
				value: "Custom Button 001",
				update: () => {},
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BUTTON_NAME, value)
			}
		]
	}
}
