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

        console.log('time in game  ', currentTime - player.enterTime + player.timeInGame);
        const { data, error } = await supabase
            .from('players')
            .update({
                time_in_game: player.timeInGame + (currentTime - player.enterTime),
            })
            .eq('id', address)
    },
}