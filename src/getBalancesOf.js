const axios = require("axios");

/*
 * Query the graph to get balances of address
 */
module.exports = async function getBalancesOf(_address) {
  try {
    const query = `
    {
      erc1155Balances(
        where: {account: "${_address}", valueExact_gt: "0"}
      ) {
        token {
          identifier
          uri
        }
        valueExact
      }
    }
    `;

    const response = await axios.post(process.env.SUBGRAPH_URL, { query });

    const balancesOf = response.data.data.erc1155Balances.map((val) => ({
      tokenId: val.token.identifier,
      amount: val.valueExact,
      uri: val.token.uri,
    }));

    return balancesOf;
  } catch (err) {
    console.error(err);
    return [];
  }
};
