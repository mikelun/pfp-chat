const createClient = require('@supabase/supabase-js').createClient;

supabase = null;

development = false;

developingUI = false;

module.exports = {
    initializeSupabase: async function () {
        if (developingUI) return;
        console.log("INITIALIZING SUPABASE");
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    },

    getPlayerData: async function (address) {
        if (developingUI) return;
        return await supabase
            .from(development ? 'development_players' : 'players')
            .select('*')
            .eq('id', address)
    },

    createPlayer: async function (address) {
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
            })
            .eq('id', address)
    },


    getPlayerItems: async function (address) {
        if (developingUI) return;
        return await supabase
            .from('items')
            .select()
            .eq('address', address)
    }



}