require("dotenv").config();
const axios = require("axios");

/*
 * Query the graph to see if player has minted
 * true if player has minted
 * false if player has not minted
 */
module.exports = async function getHasMinted(_address, _tokenId) {
  try {
    const query = `
    {
      erc1155Transfers(
        where: {from: null, to: "${_address}", token_: {identifier: "${_tokenId}"}}
      ) {
        id
      }
    }
    `;
    const response = await axios.post(process.env.SUBGRAPH_URL, { query });
    const transfers = response.data.data.erc1155Transfers;
    return transfers.length == 0 ? false : true;
  } catch (err) {
    console.error(err);
    return true;
  }
};
