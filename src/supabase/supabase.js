const createClient = require('@supabase/supabase-js').createClient;

supabase = null;

module.exports = {
    initializeSupabase: function () {
        console.log("INITIALIZING SUPABASE");
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    },
    getPlayerData: async function (address) {
        console.log("SENDING INSERT PLAYER REQUEST");
        const { data, error } = await supabase
            .from('players')
            .insert([
                { id: address, time_in_game: 0, killed_monsters: 0 }
            ]);

        console.log(data, error);
    }
}