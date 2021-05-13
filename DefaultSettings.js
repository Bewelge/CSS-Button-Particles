import { setSetting } from "./Settings.js"
import { getCssVariable } from "./Util.js"

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
const TAB_GENERAL = "General"
const TAB_AUDIO = "Audio"
const TAB_VIDEO = "Video"

export const SETTING_IDS = {
	PARTICLE_AMOUNT: "particleAmount",
	ANIMATION_DURATION: "animationDuration",
	KEYFRAME_AMOUNT: "keyframes",
	SIMULATIONS_PER_KEYFRAME: "simsPerKeyframe",
	GRAVITY: "grav",
	FRICTION: "fric",
	ANGULAR_FRICTION: "angFric",
	ANGLE_SPREAD_EVENLY: "anglSprd",
	START_ANGLE: "startAngle",
	START_SIZE: "startSiz",
	START_RADIUS: "startRad",
	SIZE_CHANGE: "sizeChange",
	ROTATION_CHANGE: "rotChange",
	START_SPEED: "spd",
	BUTTON_WIDTH: "btnWd",
	BUTTON_HEIGHT: "btnHt",
	BG_WIDTH: "bgW",
	BG_HEIGHT: "bgH",
	BG_COLOR: "black"
}
const defaultSettings = {
	General: {
		default: [
			{
				type: "slider",
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
				type: "slider",
				id: SETTING_IDS.ANIMATION_DURATION,
				label: "Animation duration (s)",
				value: 1.5,
				min: 0.05,
				max: 60,
				step: 0.05,
				recreateCss: false,
				onChange: value => setSetting(SETTING_IDS.ANIMATION_DURATION, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.KEYFRAME_AMOUNT,
				label: "Keyframe amount",
				value: 10,
				min: 2,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.KEYFRAME_AMOUNT, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.SIMULATIONS_PER_KEYFRAME,
				label: "Simulations per Keyframe",
				value: 25,
				min: 1,
				max: 500,
				step: 1,
				recreateCss: true,
				onChange: value =>
					setSetting(SETTING_IDS.SIMULATIONS_PER_KEYFRAME, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.GRAVITY,
				label: "Gravity",
				value: 10,
				min: -100,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.GRAVITY, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.FRICTION,
				label: "Friction",
				value: 0.02,
				min: 0,
				max: 1,
				step: 0.01,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.FRICTION, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.ANGULAR_FRICTION,
				label: "Angular friction",
				value: 0.02,
				min: 0,
				max: 1,
				step: 0.01,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.ANGULAR_FRICTION, value)
			},
			{
				type: "checkbox",
				id: SETTING_IDS.ANGLE_SPREAD_EVENLY,
				label: "Spread start angle evenly",
				value: true,
				recreateCss: true,
				onChange: event =>
					setSetting(SETTING_IDS.ANGLE_SPREAD_EVENLY, event.target.checked)
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.START_ANGLE,
				label: "Starting Angle",
				lowerValue: 0,
				upperValue: Math.PI * 2,
				min: 0,
				max: Math.PI * 2,
				step: 0.1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_ANGLE, [lower, upper])
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.START_SIZE,
				label: "Particle Size",
				lowerValue: 15,
				upperValue: 25,
				min: 0,
				max: 100,
				step: 0.5,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_SIZE, [lower, upper])
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.START_RADIUS,
				label: "Starting Radius",
				lowerValue: 45,
				upperValue: 45,
				min: 0,
				max: 100,
				step: 1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_RADIUS, [lower, upper])
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.SIZE_CHANGE,
				label: "Size Change",
				lowerValue: 5,
				upperValue: 10,
				min: -100,
				max: 100,
				step: 0.1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.SIZE_CHANGE, [lower, upper])
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.ROTATION_CHANGE,
				label: "Direction change",
				lowerValue: -0.1,
				upperValue: 0.1,
				min: -0.5,
				max: 0.5,
				step: 0.01,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.ROTATION_CHANGE, [lower, upper])
			},
			{
				type: "sliderMinMax",
				id: SETTING_IDS.START_SPEED,
				label: "Particle Speed",
				lowerValue: 2,
				upperValue: 15,
				min: 0,
				max: 60,
				step: 0.1,
				recreateCss: true,
				onChange: (lower, upper) =>
					setSetting(SETTING_IDS.START_SPEED, [lower, upper])
			},

			{
				type: "slider",
				id: SETTING_IDS.BUTTON_WIDTH,
				label: "Button Width",
				value: 90,
				min: 50,
				max: 500,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BUTTON_WIDTH, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.BUTTON_HEIGHT,
				label: "Button Height",
				value: 90,
				min: 50,
				max: 500,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BUTTON_HEIGHT, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.BG_WIDTH,
				label: "Bg Width",
				value: 200,
				min: 50,
				max: 2500,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BG_WIDTH, value)
			},
			{
				type: "slider",
				id: SETTING_IDS.BG_HEIGHT,
				label: "Bg Height",
				value: 200,
				min: 50,
				max: 2500,
				step: 1,
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BG_HEIGHT, value)
			},
			{
				type: "color",
				id: SETTING_IDS.BG_COLOR,
				label: "Button background color",
				value: getCssVariable("buttonColor"),
				recreateCss: true,
				onChange: value => setSetting(SETTING_IDS.BG_COLOR, value)
			}
		]
	}
}
