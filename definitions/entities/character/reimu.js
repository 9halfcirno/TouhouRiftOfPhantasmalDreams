export default {
	thid: "th:entity=character/reimu",
	texture: "th:texture=entity/reimu",
	module: "th:model=game_2d",

	components: {
		"th:speed": Math.E / 16,
		"th:hp": {
			hp: 5,
			maxHp: 9,
		},
	}
}