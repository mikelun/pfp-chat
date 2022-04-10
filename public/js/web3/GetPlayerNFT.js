export async function getPlayerNFT(moralis) {
    const {result} = await moralis.Web3API.account.getNFTs();
    const promises = result.map((r) => {
        console.log(r);
        if (r.token_uri) {
            let url = fixURL(r.token_uri);
            try {
                return fetch(url, { credentials: 'omit' })
                    .then(response => {
                        if (!null)
                            return response.json();
                        else return null;
                    })
                    .then(data => {
                        if (data && data.image) {
                            return { image: fixURL2(data.image), name: data.name };
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } catch (err) {
                //console.log(err);
            }
        }

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