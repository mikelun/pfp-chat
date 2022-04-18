import { sceneEvents } from "../Events/EventsCenter";

export async function getPlayerNFT(moralis) {
    const playerAddress1 = '0xeac41D05531770b85ad1E0f145b94BFE205bDa78';
    const playerAddress2 = '0xffE06cb4807917bd79382981f23d16A70C102c3B';
    //const result = await moralis.Web3.getNFTs({ chain: 'eth', address: playerAddress1 });
    
    const {result} = await moralis.Web3API.account.getNFTs();
    
    var pageResults = [];
    var currentPage;
    sceneEvents.on('getNFTsFromPage', async (page) => {
        currentPage = page;

        if (page <= pageResults.length) {
            sceneEvents.emit('getNFTsFromPageResult', pageResults[page - 1]);
            return;
        }

        let count = 0;
        const promises = result.map(async (r) => {
            if ((page - 1) * 12 <= count && count < page * 12) {
                count++;
                if (r.token_uri) {
                    let url = fixURL(r.token_uri);
                    try {
                        // if url is data:application/json; fetch right away
                        // if not, proxy via /metadata?uri=
                        let data
                        if (url.startsWith("data:application/json")) {
                            data = await fetch(url).then(r => r.json());
                        } else if (false) {
                            data = await moralis.Web3.getMetadata({ chain: 'eth', uri: url });
                        } else {
                            const proxiedURL = `/metadata?uri=${encodeURIComponent(url)}`;
                            data = await fetch(proxiedURL).then(r => { return r.json() });
                        }
    
                        if (data && data.image) {
                            return { image: fixImageURL(data.image), name: data.name };
                        }
    
                    } catch (err) {
                        console.log('Error with', r.token_uri, err);
                    }
                }
            } else {
                count++;
                return null;
            }
        })
        Promise.all(promises).then(r => {
            r = r.filter(data => data != null);
            if (currentPage > pageResults.length) {
                pageResults.push(r);
            }
            sceneEvents.emit('getNFTsFromPageResult', r);
        });
    });

    sceneEvents.emit('makeNFTsPanel', result.length);
}


function fixURL(url) {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs/").slice(-1)[0];
    }
    else {
        return url;
    }
}
function fixImageURL(url) {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)[0];
    } else {
        return url;
    }
}