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
        
        console.log('TRYING TO UPDATE PLAYER INFO', address, " x ", player.x, " y ", player.y, " room ", player.room, " time ", currentTime);
        
        const playerData = await this.getPlayerData(address);

        const timeInGame = playerData.data[0].time_in_game ? playerData.data[0].time_in_game : 0;

        // room - planet
        const room = player.room.split('$')[0];

        const { data, error } = await supabase
            .from('players')
            .update({
                time_in_game: timeInGame + (currentTime - player.enterTime),
                x: Math.floor(player.x),
                y: Math.floor(player.y),
                map_id: player.mapId,
                room: room,
            })
            .eq('id', address)
        console.log('UPDATED PLAYER INFO', data, " error ", error);
    },
}