const createClient = require('@supabase/supabase-js').createClient;

supabase = null;

module.exports = {
    initializeSupabase: async function () {
        console.log("INITIALIZING SUPABASE");
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    },

    getPlayerData: async function (address) {
        return await supabase
            .from('players')
            .select('*')
            .eq('id', address)
    },

    createPlayer : async function(address) {
        return await supabase
            .from('players')
            .insert({
                id: address,
            })
    },

    updatePlayerInfo: async function (player) {
        if (!player && !player.address) return;

        const address = player.address;

        const currentTime = Math.floor(Date.now() / 1000);
        
        // room - planet
        const planet = player.room.split('$')[0];
        const timeInGame = player.timeInGame ? player.timeInGame : 0;
        
        const { data, error } = await supabase
            .from('players')
            .update({
                time_in_game: timeInGame + (currentTime - player.enterTime),
                x: Math.floor(player.x),
                y: Math.floor(player.y),
                map_id: player.mapId,
                planet: planet,
                killed_monsters: player.killedMonsters,
            })
            .eq('id', address)
        console.log('UPDATED PLAYER INFO', data, " error ", error);
    },
}