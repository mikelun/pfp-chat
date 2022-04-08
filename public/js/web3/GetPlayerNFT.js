export async function getPlayerNFT(moralis) {
    const { result } = await moralis.Web3API.account.getNFTs()
    const promises = result.map((r) => {
        let url = fixURL(r.token_uri);
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.image) {
                    return fixURL2(data.image);
                }
            });
    })
    return Promise.all(promises);
}

function fixURL(url) {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://ipfs/").slice(-1)[0];
    }
    else {
        return url;
    }
}
function fixURL2(url) {
    if (url.startsWith("ipfs")) {
        return "https://ipfs.moralis.io:2053/ipfs/" + url.split("ipfs://").slice(-1)[0];
    } else {
        return url;
    }
}