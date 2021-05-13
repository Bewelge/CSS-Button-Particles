import { SETTING_IDS } from "./DefaultSettings.js"
import { getSetting } from "./Settings.js"
import { getCssVariable, getRange } from "./Util.js"
class Shape {
	constructor(type, opts) {
		this.type = type
		if (this.type == "circle") {
		}
		this.positions = opts.positions
		this.sizes = opts.sizes

		this.color = opts.color || "black"
	}
}

export class ShapeCreator {
	constructor(keyframes, params) {
		this.params = params
		this.keyframes = keyframes
	}
	create() {
		let p = this.params
		let shapes = []
		for (let i = 0; i < p.particleAmount; i++) {
			let {
				startAngle,
				momentum,
				startRadius,
				startSizeX,
				startSizeY,
				sizeChange,
				rotChange
			} = this.getRandomParams(p)

			let isAngleSpreadEvenly = getSetting(SETTING_IDS.ANGLE_SPREAD_EVENLY)
			let rot = isAngleSpreadEvenly
				? p.startAngle.min + (i / p.particleAmount) * getRange(p.startAngle)
				: startAngle
			let startX =
				getSetting(SETTING_IDS.BG_WIDTH) / 2 + Math.cos(rot) * startRadius
			let startY =
				getSetting(SETTING_IDS.BG_HEIGHT) / 2 + Math.sin(rot) * startRadius

			let motX = Math.cos(rot) * momentum
			let motY = Math.sin(rot) * momentum

			let positions = []
			let sizes = []
			let x = startX
			let y = startY

			let sizeX = startSizeX
			let sizeY = startSizeY

			this.keyframes.forEach((keyframe, keyframeIndex) => {
				positions.push([Math.floor(x - sizeX / 2), Math.floor(y - sizeY / 2)])
				sizes.push([Math.floor(sizeX), Math.floor(sizeY)])
				for (
					// let j = this.keyframes[keyframeIndex - 1] || 0;
					// j < (keyframe * 1) / this.keyframes.length;
					// j++
					let j = 0;
					j < getSetting(SETTING_IDS.SIMULATIONS_PER_KEYFRAME);
					j++
				) {
					const friction = 1 - getSetting(SETTING_IDS.FRICTION)
					motX *= friction
					motY *= friction
					motX = Math.cos(rot) * momentum
					motY = Math.sin(rot) * momentum
					motY -= getSetting(SETTING_IDS.GRAVITY) / 10
					momentum *= friction

					sizeX = Math.max(0, sizeX - sizeChange / 5)
					sizeY = sizeX
					// sizeChange *= 1.1

					rot += rotChange
					rotChange *= 1 - getSetting(SETTING_IDS.ANGULAR_FRICTION)
					// rotChange *= 1.5
					// rotChange = rotChangeChange(rotChange) * 0.0001

					x += motX
					y += motY
				}
			})
			// positions[positions.length - 1] = positions[positions.length - 1]
			// sizes[sizes.length - 1] = [0, 0]
			let color = getCssVariable("buttonColor1") //"rgba(12,91,131," + (0.6 + Math.random() * 0.4) + ")" //"#90a4ae7a" //"rgba(0,0,0," + Math.random() + ")" //getRandomColor()

			let rndShape = new Shape("trapez", {
				positions,
				sizes,
				color
			})
			shapes.push(rndShape)
		}
		// console.log(shapes)
		return shapes
	}

	getRandomParams(p) {
		let startAngle = getRandomInRange(p.startAngle.min, p.startAngle.max)

		let startSizeX = getRandomInRange(p.startSize.min, p.startSize.max)
		let startSizeY = startSizeX

		let startRadius = getRandomInRange(p.startRadius.min, p.startRadius.max)

		let sizeChange = getRandomInRange(p.sizeChange.min, p.sizeChange.max)

		let rotChange = getRandomInRange(p.rotChange.min, p.rotChange.max)

		let momentum = getRandomInRange(p.speed.min, p.speed.max)
		return {
			startAngle,
			momentum,
			startRadius,
			startSizeX,
			startSizeY,
			sizeChange,
			rotChange
		}
	}
}

export const paramsFromSettings = () => {
	return {
		particleAmount: getSetting(SETTING_IDS.PARTICLE_AMOUNT),
		startAngle: getSetting(SETTING_IDS.START_ANGLE), // 0,
		startSize: getSetting(SETTING_IDS.START_SIZE), // 0,
		startRadius: getSetting(SETTING_IDS.START_RADIUS), // 0,
		sizeChange: getSetting(SETTING_IDS.SIZE_CHANGE), // 0,
		rotChange: getSetting(SETTING_IDS.ROTATION_CHANGE), // 0,
		speed: getSetting(SETTING_IDS.START_SPEED) // 0,
	}
}

function getRandomInRange(min, max) {
	return min + Math.random() * Math.max(0, max - min)
}
