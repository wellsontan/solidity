const knex = require("knex");
const config = require("../knexfile"); // get knex config
const db = knex(config.development); // get db

module.exports = {
  addBeefProduct,
  getBeefProductbyID,
  addJourney,
  getJourneiesofBeefProduct,
  finishJourney,
  addUser,
  getUsers,
  getUserbyID,
  cancelCertifaction,
  // deleteUserbyID,
  // updateUserbyID,
  // addDocument,
  // getDocumentsbyCertification,
  // getDocumentbyHash,
  // getDocuments,
  // addCertification,
  // getCertificationbyID,
  // getCertifications,
};
//Beef product:
//in use
async function addBeefProduct(beef_product) {
  const [id] = await db("beef_product").insert(beef_product);
  return id;
}

//in use
function getBeefProductbyID(product_id) {
  return db("beef_product").where({ product_id });
}

//Journey:
//in use
async function addJourney(journey) {
  const [id] = await db("journey").insert(journey);
  return id;
}

//in use
function getJourneiesofBeefProduct(product_id) {
  return db("journey").where({ product_id });
}

//in use
function finishJourney(product_id, user_id, changes) {
  return db("journey")
    .where({ product_id, user_id })
    .update(changes, [product_id]);
}

// Users
//in use
async function addUser(user) {
  const [id] = await db("user").insert(user);
  return id;
}

//in use
function getUserbyID(id_address) {
  return db("user").where({ id_address }).first();
}

function cancelCertifaction(id_address) {
  return db("user")
    .where({ id_address })
    .update({ valid_status: false }, [id_address]);
}

function getUsers() {
  return db("user");
}

// function deleteUserbyID(id_address) {
//   return db("user").where({ id_address }).del();
// }

// function updateUserbyID(id_address, changes) {
//   return db("user").where({ id_address }).update(changes, [id_address]);
// }

// //Doc:
// //in use
// async function addDocument(document) {
//   const [id] = await db("document").insert(document);
//   return id;
// }

// //in use
// function getDocumentsbyCertification(certification_id) {
//   return db("document").where({ certification_id });
// }

// //in use
// function getDocumentbyHash(hash_value) {
//   return db("document").where({ hash_value }).first();
// }

// function getDocuments() {
//   return db("document");
// }

// //Certification:
// //in use
// async function addCertification(certifier) {
//   const [id] = await db("certification").insert(certifier);
//   return id;
// }

// //in use
// function getCertificationbyID(id) {
//   return db("certification").where({ id }).first();
// }

// function getCertifications() {
//   return db("certification");
// }
