import { SETTING_IDS } from "./Settings/DefaultSettings.js"
import { getSetting } from "./Settings/Settings.js"
import { angle, dist, getRange } from "./Util/Util.js"
import { SHAPE_TYPES } from "./CssShapes.js"
import { getNewRng } from "./Settings/Rng.js"
class Shape {
	constructor(opts) {
		this.type = opts.shapeType || SHAPE_TYPES.CIRCLE
		this.positions = opts.positions || []
		this.sizes = opts.sizes || []

		this.color = opts.color || "black"
		this.degree = opts.degree
	}
}
export const getShapesFromSettings = (keyframes, settings) => {
	return new ShapeCreator(keyframes, settings).create()
}
class ShapeCreator {
	constructor(keyframes, params) {
		this.params = params
		this.keyframes = keyframes
		this.rng = getNewRng(params[SETTING_IDS.SEED])
	}
	create() {
		let p = this.params
		let shapes = []
		const shapeType = p[SETTING_IDS.SHAPE_TYPE]
		const simulationsPerKeyframe = p[SETTING_IDS.SIMULATIONS_PER_KEYFRAME]

		const color = p[SETTING_IDS.PARTICLE_COLOR]

		const friction = 1 - p[SETTING_IDS.FRICTION]
		const thrust = p[SETTING_IDS.THRUST]
		const gravity = p[SETTING_IDS.GRAVITY]
		const buttonGravity = p[SETTING_IDS.GRAVITY_TOWARDS_BUTTON]
		const angularFriction = 1 - p[SETTING_IDS.ANGULAR_FRICTION]

		const bgWidth = p[SETTING_IDS.BG_WIDTH]
		const bgHeight = p[SETTING_IDS.BG_HEIGHT]
		const btnWidth = p[SETTING_IDS.BUTTON_WIDTH]
		const btnHeight = p[SETTING_IDS.BUTTON_HEIGHT]

		console.log(p)
		for (let i = 0; i < p[SETTING_IDS.PARTICLE_AMOUNT]; i++) {
			let rndParams = this.getRandomParams(p)

			let rotChangeInRad =
				(rndParams[SETTING_IDS.ROTATION_CHANGE] * Math.PI) / 180

			let spawnAngle = getStartRotation(
				p,
				i,
				rndParams[SETTING_IDS.SPAWN_ANGLE]
			)
			let spawnAngleInRad = (spawnAngle * Math.PI) / 180
			let startAngleInRad = (rndParams[SETTING_IDS.START_ANGLE] * Math.PI) / 180

			let direction = spawnAngleInRad + startAngleInRad

			let startX =
				bgWidth / 2 +
				Math.cos(spawnAngleInRad) * rndParams[SETTING_IDS.START_RADIUS]
			let startY =
				bgHeight / 2 +
				Math.sin(spawnAngleInRad) * rndParams[SETTING_IDS.START_RADIUS]

			let motX = Math.cos(direction) * rndParams[SETTING_IDS.START_SPEED]
			let motY = Math.sin(direction) * rndParams[SETTING_IDS.START_SPEED]

			let positions = []
			let sizes = []
			let x = startX
			let y = startY

			let sizeX = rndParams[SETTING_IDS.START_SIZE]

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

					motX += Math.cos(direction) * thrust
					motY += Math.sin(direction) * thrust

					motY -= gravity / 250

					let angToMiddle = angle(x, y, bgWidth / 2, bgHeight / 2)
					let disToMiddle = dist(x, y, bgWidth / 2, bgHeight / 2)
					motX +=
						(Math.cos(angToMiddle) * buttonGravity * 100) /
						Math.pow(Math.max(btnWidth / 2, disToMiddle), 2)
					motY +=
						(Math.sin(angToMiddle) * buttonGravity * 100) /
						Math.pow(Math.max(btnHeight / 2, disToMiddle), 2)

					sizeX = Math.max(0, sizeX * rndParams[SETTING_IDS.SIZE_MULTIPLIER])
					sizeX = Math.max(0, sizeX + rndParams[SETTING_IDS.SIZE_ADDER])
					sizeY = shapeType == SHAPE_TYPES.LINE ? sizeY : sizeX
					// console.log(sizeX)
					direction += rotChangeInRad
					rotChangeInRad *= angularFriction

					x += motX
					y += motY
				}
			})

			let degree = Math.floor(this.rng() * 360)

			let rndShape = new Shape({
				shapeType,
				positions,
				sizes,
				color,
				degree
			})
			shapes.push(rndShape)
		}

		return shapes
	}

	getRandomParams(p) {
		let spawnAngle = this.getRandomInRange(
			p[SETTING_IDS.SPAWN_ANGLE].min,
			p[SETTING_IDS.SPAWN_ANGLE].max
		)
		let startAngle = this.getRandomInRange(
			p[SETTING_IDS.START_ANGLE].min,
			p[SETTING_IDS.START_ANGLE].max
		)

		let startSizeX = this.getRandomInRange(
			p[SETTING_IDS.START_SIZE].min,
			p[SETTING_IDS.START_SIZE].max
		)

		let startRadius = this.getRandomInRange(
			p[SETTING_IDS.START_RADIUS].min,
			p[SETTING_IDS.START_RADIUS].max
		)

		let sizeChangeMult = this.getRandomInRange(
			p[SETTING_IDS.SIZE_MULTIPLIER].min,
			p[SETTING_IDS.SIZE_MULTIPLIER].max
		)
		let sizeChangeAdd = 0
		if (p.hasOwnProperty(SETTING_IDS.SIZE_ADDER)) {
			sizeChangeAdd = this.getRandomInRange(
				p[SETTING_IDS.SIZE_ADDER].min,
				p[SETTING_IDS.SIZE_ADDER].max
			)
		}

		let rotChange = this.getRandomInRange(
			p[SETTING_IDS.ROTATION_CHANGE].min,
			p[SETTING_IDS.ROTATION_CHANGE].max
		)

		let momentum = this.getRandomInRange(
			p[SETTING_IDS.START_SPEED].min,
			p[SETTING_IDS.START_SPEED].max
		)
		return {
			[SETTING_IDS.SPAWN_ANGLE]: spawnAngle,
			[SETTING_IDS.START_ANGLE]: startAngle,
			[SETTING_IDS.START_SPEED]: momentum,
			[SETTING_IDS.START_RADIUS]: startRadius,
			[SETTING_IDS.START_SIZE]: startSizeX,
			[SETTING_IDS.SIZE_MULTIPLIER]: sizeChangeMult,
			[SETTING_IDS.SIZE_ADDER]: sizeChangeAdd,
			[SETTING_IDS.ROTATION_CHANGE]: rotChange
		}
	}
	getRandomInRange(min, max) {
		return (
			parseFloat(min) +
			this.rng() * Math.max(0, parseFloat(max) - parseFloat(min))
		)
	}
}

export const paramsFromSettings = () => {
	return {
		[SETTING_IDS.SEED]: getSetting(SETTING_IDS.SEED),
		[SETTING_IDS.PARTICLE_AMOUNT]: getSetting(SETTING_IDS.PARTICLE_AMOUNT),
		[SETTING_IDS.SPAWN_ANGLE]: getSetting(SETTING_IDS.SPAWN_ANGLE), // 0,
		[SETTING_IDS.START_ANGLE]: getSetting(SETTING_IDS.START_ANGLE), // 0,
		[SETTING_IDS.START_SIZE]: getSetting(SETTING_IDS.START_SIZE), // 0,
		[SETTING_IDS.START_RADIUS]: getSetting(SETTING_IDS.START_RADIUS), // 0,
		[SETTING_IDS.SIZE_MULTIPLIER]: getSetting(SETTING_IDS.SIZE_MULTIPLIER), // 0,
		[SETTING_IDS.SIZE_ADDER]: getSetting(SETTING_IDS.SIZE_ADDER), // 0,
		[SETTING_IDS.ROTATION_CHANGE]: getSetting(SETTING_IDS.ROTATION_CHANGE), // 0,
		[SETTING_IDS.START_SPEED]: getSetting(SETTING_IDS.START_SPEED), // 0,
		[SETTING_IDS.SHAPE_TYPE]: getSetting(SETTING_IDS.SHAPE_TYPE),
		[SETTING_IDS.SIMULATIONS_PER_KEYFRAME]: getSetting(
			SETTING_IDS.SIMULATIONS_PER_KEYFRAME
		),
		[SETTING_IDS.PARTICLE_COLOR]: getSetting(SETTING_IDS.PARTICLE_COLOR),
		[SETTING_IDS.FRICTION]: getSetting(SETTING_IDS.FRICTION),
		[SETTING_IDS.THRUST]: getSetting(SETTING_IDS.THRUST),
		[SETTING_IDS.GRAVITY]: getSetting(SETTING_IDS.GRAVITY),
		[SETTING_IDS.GRAVITY_TOWARDS_BUTTON]: getSetting(
			SETTING_IDS.GRAVITY_TOWARDS_BUTTON
		),
		[SETTING_IDS.ANGULAR_FRICTION]: getSetting(SETTING_IDS.ANGULAR_FRICTION),
		[SETTING_IDS.BG_WIDTH]: getSetting(SETTING_IDS.BG_WIDTH),
		[SETTING_IDS.BG_HEIGHT]: getSetting(SETTING_IDS.BG_HEIGHT),
		[SETTING_IDS.BUTTON_WIDTH]: getSetting(SETTING_IDS.BUTTON_WIDTH),
		[SETTING_IDS.BUTTON_HEIGHT]: getSetting(SETTING_IDS.BUTTON_HEIGHT)
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
	let isAngleSpreadEvenly = p[SETTING_IDS.ANGLE_SPREAD_EVENLY]
	return isAngleSpreadEvenly
		? p.spawnAngle.min +
				Math.max(0, (i + 1) / p.particleAmount) * getRange(p.spawnAngle)
		: spawnAngle
}
