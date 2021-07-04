import { SETTING_IDS } from "./Settings/DefaultSettings.js"
import { getSetting } from "./Settings/Settings.js"

export const getKeyframes = amount => {
	let keyframes = []
	let keyframeAmount = amount
	for (let i = 0; i <= keyframeAmount; i++) {
		keyframes.push(i / keyframeAmount)
	}
	return keyframes
}
