const createClient = require('@supabase/supabase-js').createClient;

supabase = null;

development = false;

developingUI = false;

module.exports = {
    initializeSupabase: async function () {
        if (developingUI) return;
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    },

    getPlayerData: async function (address) {
        if (!address) return;
        if (developingUI) return;
        return await supabase
            .from(development ? 'development_players' : 'players')
            .select('*')
            .eq('id', address)
    },

    createPlayer: async function (address) {
        if (!address) return;
        if (developingUI) return;
        return await supabase
            .from(development ? 'development_players' : 'players')
            .insert({
                id: address,
            })
    },

    getPlayersKilledMonster: async function () {
        if (developingUI) return;
        return await supabase
            .from(development ? 'development_players' : 'players')
            .select(`id,
            killed_monsters`)
    },

    updatePlayerInfo: async function (player) {
        if (developingUI) return;
        if (!player && !player.address) return;

        const address = player.address;

        const currentTime = Math.floor(Date.now() / 1000);

        const planet = player.room.split('$')[0];
        const timeInGame = player.timeInGame ? player.timeInGame : 0;

        const { data, error } = await supabase
            .from(development ? 'development_players' : 'players')
            .update({
                time_in_game: timeInGame + (currentTime - player.enterTime),
                x: Math.floor(player.x),
                y: Math.floor(player.y),
                map_id: player.mapId,
                planet: planet,
                killed_monsters: player.killedMonsters,
                coins: player.coins,
                textureId: player.textureId,
                nft: player.nft,
                weapon_id: player.weapon.id,
                is_home: player.isHome ? player.isHome : false,
                space: player.space,
            })
            .eq('id', address)
    },


    getPlayerItems: async function (address) {
        if (!address) return;
        if (developingUI) return;
        return await supabase
            .from('items')
            .select()
            .eq('address', address)
    },

    checkItem: async function (address, category, itemId) {
        if (!address) return;
        return (async () => {
            console.log("HERE1")
            if (developingUI) return;
            const result = await supabase
                .from('items')
                .select()
                .eq('address', address);

            if (!result || !result.data || !result.data[0] || !result.data[0].items) return false;
            return result.data[0].items.find(item => item.category === category && item.item_id == itemId);

        })()
    },
    getRoom: async function (room) {
        if (developingUI) return;
        return await supabase
            .from('rooms')
            .select()
            .eq('id', room)
    },
    createRoom: async function (room, address) {
        if (!address) return;
        if (developingUI) return;
        return await supabase
            .from('rooms')
            .insert({
                id: room,
                owner: address
            })
    },
    updateRoom: async function (room, changedTiles) {
        if (developingUI) return;
        return await supabase
            .from('rooms')
            .update({
                changed_tiles: changedTiles,
            })
            .eq('id', room)
    },
    createSpace: async function (data) {
        if (developingUI) return;
        return await supabase
            .from('spaces')
            .insert({
                space_id: data.spaceId,
                map_id: data.mapId,
                host: data.host,
                name: data.name,
            });
    },
    connectToSpace: async function (spaceId) {
        if (developingUI) return;
        return await supabase
            .from('spaces')
            .update({
                connected: true,
            })
            .eq('space_id', spaceId)
    }



}