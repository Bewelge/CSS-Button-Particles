import { getSetting } from "./Settings.js"
import { getCssVariable } from "./Util.js"
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
var particleContainerDimensions = {
	width: 300,
	height: 300
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
				startX,
				startY,
				startSizeX,
				startSizeY,
				sizeChange,
				rotChange
			} = this.getRandomParams(p)

			let rotChangeChange = val => val

			let rot = startAngle
			let motX = Math.cos(rot) * momentum
			let motY = Math.sin(rot) * momentum

			let positions = []
			let sizes = []
			let x = startX
			let y = startY

			let sizeX = startSizeX
			let sizeY = startSizeY

			this.keyframes.forEach((keyframe, keyframeIndex) => {
				for (
					let j = this.keyframes[keyframeIndex - 1] || 0;
					j < (keyframe * 50) / this.keyframes.length;
					j++
				) {
					motX = Math.cos(rot) * momentum
					motY = Math.sin(rot) * momentum
					momentum *= 0.95

					sizeX = Math.max(0, Math.min(100, sizeX - sizeChange / 5))
					sizeY = sizeX
					sizeChange *= 1.1

					rot += rotChange
					rotChange *= 1.5
					// rotChange = rotChangeChange(rotChange) * 0.0001

					x += motX
					y += motY
				}
				positions.push([Math.floor(x - sizeX / 2), Math.floor(y - sizeY / 2)])
				sizes.push([Math.floor(sizeX), Math.floor(sizeY)])
			})
			// positions[positions.length - 1] = positions[positions.length - 1]
			// sizes[sizes.length - 1] = [0, 0]
			let color = getCssVariable("buttonColor1") //"rgba(12,91,131," + (0.6 + Math.random() * 0.4) + ")" //"#90a4ae7a" //"rgba(0,0,0," + Math.random() + ")" //getRandomColor()

			let rndShape = new Shape("circle", {
				positions,
				sizes,
				color
			})
			shapes.push(rndShape)
		}
		console.log(shapes)
		return shapes
	}

	getRandomParams(p) {
		let startAngleMin = p.startAngleMin
		let startAngleMax = p.startAngleMax
		let startAngle = getRandomInRange(startAngleMin, startAngleMax)

		let startSizeMin = p.startSizeMin
		let startSizeMax = p.startSizeMax
		let startSizeX = getRandomInRange(startSizeMin, startSizeMax)
		let startSizeY = startSizeX

		let startRadiusMin = p.startRadiusMin
		let startRadiusMax = p.startRadiusMax
		let startRadius = getRandomInRange(startRadiusMin, startRadiusMax)

		console.log(startRadius)
		let startX =
			particleContainerDimensions.width / 2 + Math.cos(startAngle) * startRadius
		let startY =
			particleContainerDimensions.height / 2 +
			Math.sin(startAngle) * startRadius

		let sizeChangeMin = p.sizeChangeMin
		let sizeChangeMax = p.sizeChangeMax
		let sizeChange = getRandomInRange(sizeChangeMin, sizeChangeMax)

		let rotChangeMin = p.rotChangeMin
		let rotChangeMax = p.rotChangeMax
		let rotChange = getRandomInRange(rotChangeMin, rotChangeMax)

		let startMomentumMin = p.startMomentumMin
		let startMomentumMax = p.startMomentumMax
		let momentum = getRandomInRange(startMomentumMin, startMomentumMax)
		return {
			startAngle,
			momentum,
			startX,
			startY,
			startSizeX,
			startSizeY,
			sizeChange,
			rotChange
		}
	}
}

export const paramsFromSettings = () => {
	return {
		particleAmount: getSetting("particleAmount"),
		startAngleMin: getSetting("startAngleMin"), // 0,
		startAngleMax: getSetting("startAngleMax"), // Math.PI * 2,
		startSizeMin: getSetting("startSizeMin"), // 5,
		startSizeMax: getSetting("startSizeMax"), // 30,
		startRadiusMin: getSetting("startRadiusMin"), // 45,
		startRadiusMax: getSetting("startRadiusMax"), // 45,
		sizeChangeMin: getSetting("sizeChangeMin"), // 5,
		sizeChangeMax: getSetting("sizeChangeMax"), // 5,
		rotChangeMin: getSetting("rotChangeMin"), // 0.1,
		rotChangeMax: getSetting("rotChangeMax"), // 0.1,
		startMomentumMin: getSetting("startMomentumMin"), // 15,
		startMomentumMax: getSetting("startMomentumMax") // 15
	}
}

function getRandomInRange(min, max) {
	return min + Math.random() * (max - min)
}
