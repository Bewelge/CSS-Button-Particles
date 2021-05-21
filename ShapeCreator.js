import { SETTING_IDS } from "./DefaultSettings.js"
import { getSetting } from "./Settings.js"
import { angle, dist, getRange } from "./Util.js"
import { SHAPE_TYPES } from "./CssShapes.js"
import { resetRng, rng } from "./Rng.js"
class Shape {
	constructor(opts) {
		this.type = opts.shapeType || SHAPE_TYPES.CIRCLE
		this.positions = opts.positions || []
		this.sizes = opts.sizes || []

		// if (type == SHAPE_TYPES.LINE) {
		this.color = opts.color || "black"
		this.degree = Math.floor(rng() * 360)
		// }
	}
}

export class ShapeCreator {
	constructor(keyframes, params) {
		this.params = params
		this.keyframes = keyframes
		resetRng()
	}
	create() {
		let p = this.params
		let shapes = []
		const shapeType = getSetting(SETTING_IDS.SHAPE_TYPE)
		const simulationsPerKeyframe = getSetting(
			SETTING_IDS.SIMULATIONS_PER_KEYFRAME
		)
		const color = getSetting(SETTING_IDS.PARTICLE_COLOR)

		const friction = 1 - getSetting(SETTING_IDS.FRICTION)
		const thrust = getSetting(SETTING_IDS.THRUST)
		const gravity = getSetting(SETTING_IDS.GRAVITY)
		const buttonGravity = getSetting(SETTING_IDS.GRAVITY_TOWARDS_BUTTON)
		const angularFriction = 1 - getSetting(SETTING_IDS.ANGULAR_FRICTION)

		const bgWidth = getSetting(SETTING_IDS.BG_WIDTH)
		const bgHeight = getSetting(SETTING_IDS.BG_HEIGHT)
		const btnWidth = getSetting(SETTING_IDS.BUTTON_WIDTH)
		const btnHeight = getSetting(SETTING_IDS.BUTTON_HEIGHT)
		for (let i = 0; i < p.particleAmount; i++) {
			let {
				spawnAngle,
				startAngle,
				momentum,
				startRadius,
				startSizeX,
				startSizeY,
				sizeChange,
				rotChange
			} = this.getRandomParams(p)

			let rotChangeInRad = (rotChange * Math.PI) / 180

			spawnAngle = getStartRotation(p, i, spawnAngle)
			let spawnAngleInRad = (spawnAngle * Math.PI) / 180
			let startAngleInRad = (startAngle * Math.PI) / 180

			let direction = spawnAngleInRad + startAngleInRad

			let startX = bgWidth / 2 + Math.cos(spawnAngleInRad) * startRadius
			let startY = bgHeight / 2 + Math.sin(spawnAngleInRad) * startRadius

			let motX = Math.cos(direction) * momentum
			let motY = Math.sin(direction) * momentum

			let positions = []
			let sizes = []
			let x = startX
			let y = startY

			let sizeX = startSizeX
			let sizeY = sizeX

			this.keyframes.forEach((keyframe, keyframeIndex) => {
				let { xAdjust, yAdjust } = getPositionAdjustments(
					shapeType,
					sizeY,
					sizeX
				)

				positions.push([
					Math.floor(x - sizeX / 2) + xAdjust,
					Math.floor(y - sizeY / 2) + yAdjust
				])

				sizes.push([Math.floor(sizeX), Math.floor(sizeY)])

				for (let j = 0; j < simulationsPerKeyframe; j++) {
					motX *= friction
					motY *= friction

					motX += Math.cos(direction) * thrust * 10
					motY += Math.sin(direction) * thrust * 10

					motY -= (gravity * Math.sqrt(sizeX * sizeY)) / 100

					let angToMiddle = angle(x, y, bgWidth / 2, bgHeight / 2)
					let disToMiddle = dist(x, y, bgWidth / 2, bgHeight / 2)
					motX +=
						(Math.cos(angToMiddle) * buttonGravity * 100) /
						Math.pow(Math.max(btnWidth / 2, disToMiddle), 2)
					motY +=
						(Math.sin(angToMiddle) * buttonGravity * 100) /
						Math.pow(Math.max(btnHeight / 2, disToMiddle), 2)

					sizeX = Math.max(0, sizeX * sizeChange)
					sizeY =
						shapeType == SHAPE_TYPES.LINE
							? sizeY
							: Math.max(0, sizeY * sizeChange)

					direction += rotChangeInRad
					rotChangeInRad *= angularFriction

					x += motX
					y += motY
				}
			})

			let rndShape = new Shape({
				shapeType,
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
		let spawnAngle = getRandomInRange(p.spawnAngle.min, p.spawnAngle.max)
		let startAngle = getRandomInRange(p.startAngle.min, p.startAngle.max)

		let startSizeX = getRandomInRange(p.startSize.min, p.startSize.max)
		let startSizeY = startSizeX

		let startRadius = getRandomInRange(p.startRadius.min, p.startRadius.max)

		let sizeChange = getRandomInRange(p.sizeChange.min, p.sizeChange.max)

		let rotChange = getRandomInRange(p.rotChange.min, p.rotChange.max)

		let momentum = getRandomInRange(p.speed.min, p.speed.max)
		return {
			spawnAngle,
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
		spawnAngle: getSetting(SETTING_IDS.SPAWN_ANGLE), // 0,
		startAngle: getSetting(SETTING_IDS.START_ANGLE), // 0,
		startSize: getSetting(SETTING_IDS.START_SIZE), // 0,
		startRadius: getSetting(SETTING_IDS.START_RADIUS), // 0,
		sizeChange: getSetting(SETTING_IDS.SIZE_CHANGE), // 0,
		rotChange: getSetting(SETTING_IDS.ROTATION_CHANGE), // 0,
		speed: getSetting(SETTING_IDS.START_SPEED) // 0,
	}
}

function getPositionAdjustments(shapeType, sizeY, sizeX) {
	let xAdjust = 0
	let yAdjust = 0
	if (shapeType == SHAPE_TYPES.HALF_CIRCLE) {
		yAdjust = Math.floor(sizeY) / 4
	} else if (shapeType == SHAPE_TYPES.TRIANGLE) {
		xAdjust = -Math.floor(sizeX) / 4
		yAdjust = +Math.floor(sizeY) / 4
	}
	return { xAdjust, yAdjust }
}

function getStartRotation(p, i, spawnAngle) {
	let isAngleSpreadEvenly = getSetting(SETTING_IDS.ANGLE_SPREAD_EVENLY)
	return isAngleSpreadEvenly
		? p.spawnAngle.min +
				Math.max(0, (i + 1) / p.particleAmount) * getRange(p.spawnAngle)
		: spawnAngle
}

function getRandomInRange(min, max) {
	return min + rng() * Math.max(0, max - min)
}
