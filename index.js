module.exports = function SimpleVG(mod) {
	let enabled = true,
		pendingQuests = [];

	mod.dispatch.addDefinition('C_COMPLETE_EXTRA_EVENT', 99, []);

	mod.command.add('vg', () => {
		enabled = !enabled;
		mod.command.message(`Auto Vanguard is ${enabled ? 'en' : 'dis'}abled.`);
	});

	mod.game.on('enter_game', () => {
		pendingQuests.length = 0;
	});

	mod.game.me.on('change_zone', () => {
		if (enabled && !mod.game.me.inBattleground && pendingQuests.length !== 0) completeQuests();
	});

	mod.hook('S_COMPLETE_EVENT_MATCHING_QUEST', 1, (event) => {
		if (!enabled) return;
		pendingQuests.push(event.id);
		if (!mod.game.me.inBattleground) completeQuests();
		return false;
	});

	function completeQuests() {
		while (pendingQuests.length > 0) {
			const id = pendingQuests.pop();
			mod.send('C_COMPLETE_DAILY_EVENT', 1, { id });
		}
		mod.setTimeout(() => {
			mod.send('C_COMPLETE_EXTRA_EVENT', 99, {});
		}, 1000);
	}
};
