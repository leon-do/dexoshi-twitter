const axios = require("axios");

/*
 * Query the graph to get last admin mint of address
 */
module.exports = async function getLastMint(_address) {
  try {
    const query = `
    {
      erc1155Transfers(
        where: {to: "${_address}", from: null}
        orderBy: timestamp
        orderDirection: desc
        first: 1
      ) {
        timestamp
        from {
          id
        }
        transaction {
          id
        }
      }
    }
    `;
    const response = await axios.post(process.env.SUBGRAPH_URL, { query });
    if (response.data.data.erc1155Transfers.length === 0) return 0;
    const lastMint = response.data.data.erc1155Transfers[0].timestamp;
    return Number(lastMint);
  } catch (err) {
    return 9999999999;
  }
};
