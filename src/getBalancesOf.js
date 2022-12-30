const axios = require("axios");

/*
 * Query the graph to get balances of address
 */
module.exports = async function getBalancesOf(_address) {
  try {
    const query = `
        {
            erc1155Tokens {
              uri
              balances(where: {account: "${_address}"}) {
                valueExact
              }
              identifier
            }
          }
        `;

    const response = await axios.post(process.env.SUBGRAPH_URL, { query });

    const balancesOf = response.data.data.erc1155Tokens.map((val) => ({
      tokenId: val.identifier,
      balance: val.balances[0].valueExact,
      uri: val.uri,
    }));

    return balancesOf;
  } catch (err) {
    console.log(err);
    return [];
  }
};
