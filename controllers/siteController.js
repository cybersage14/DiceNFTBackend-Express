const db = require("../utils/db");
const { checkOrderExistence } = require("../utils/functions");
const { SUCCESS, FAILED } = require("../utils/constants");

exports.saveOrder = async (req, res) => {
  const { walletAddress, email, message, nft } = req.body;

  const orderExistence = await checkOrderExistence(walletAddress, email, nft.id);

  if (orderExistence) {
    //  If this order is already existed, update it
    db.query(`
      UPDATE orders
      SET message = '${message}', nft = '${JSON.stringify(nft)}'
      WHERE wallet_address = '${walletAddress}' AND email = '${email}' AND nft_id = '${nft.id}';
    `).then(() => {
      return res.status(200).send(SUCCESS);
    }).catch(error => {
      console.log('# create error => ', error);
      return res.status(500).send(FAILED);
    });
  } else {
    //  Else create new one.
    db.query(`
      INSERT INTO orders (wallet_address, email, message, nft_id, nft) 
      VALUES('${walletAddress}', '${email}', '${message}', '${nft.id}', '${JSON.stringify(nft)}');
    `).then(() => {
      return res.status(201).send(SUCCESS);
    }).catch(error => {
      console.log('# update error => ', error);
      return res.status(500).send(FAILED);
    });
  }
};