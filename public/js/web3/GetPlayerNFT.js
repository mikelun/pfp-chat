export async function getPlayerNFT(moralis) {
    const headers = {};
    const result = await moralis.Web3.getNFTs({ chain: 'eth', address: '0xffE06cb4807917bd79382981f23d16A70C102c3B' });
    const promises = result.map((r) => {
        let url = fixURL(r.token_uri);
        try {
            return fetch(url, { credentials: 'omit'})
                .then(response => {
                    if (!null)
                        return response.json();
                    else return null;
                })
                .then(data => {
                    if (data && data.image) {
                        return fixURL2(data.image);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (err) {
            //console.log(err);
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