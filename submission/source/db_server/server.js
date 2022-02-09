const express = require("express");
const db = require("./DB/dbHelpers"); // get db helper
// init server
const server = express();
server.use(express.json());
const PORT = 5000;
server.listen(PORT, () => {
  console.log(
    `\n*** Off-chain database server running on http://localhost:${PORT}/ ***\n`
  );
});

// server greetings
server.get("/", (req, res) => {
  res.json({ message: "Off-chain database APIs were connected!" });
});

// add user
server.post("/api/user", (req, res) => {
  db.addUser(req.body)
    .then(() => {
      res.status(200).json({
        Message: `Add user ${req.body.id_address} successfully`,
      });
    })
    .catch((e) => {
      res.status(500).json({
        Message: "Add user failed",
        Error: e,
      });
    });
});

// get user by id
server.get("/api/user/:id_address", (req, res) => {
  const { id_address } = req.params;
  db.getUserbyID(id_address)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ Message: `No record of user ${id_address}` });
      }
    })
    .catch((e) => {
      res
        .status(500)
        .json({ Message: `Unable to get user ${id_address}`, Error: e });
    });
});

// update user certification to false by id
server.patch("/api/user/:id_address", (req, res) => {
  const { id_address } = req.params;
  db.cancelCertifaction(id_address)
    .then((uid) => {
      if (uid) {
        res.status(200).json({
          Message: `Drop user ${id_address} certification successfully`,
        });
      } else {
        res.status(404).json({ Message: `No record of user ${id_address}` });
      }
    })
    .catch((e) => {
      res
        .status(500)
        .json({
          Message: `Unable to cancel user ${id_address} certification`,
          Error: e,
        });
    });
});

// add beef
server.post("/api/beef", (req, res) => {
  db.addBeefProduct(req.body)
    .then(() => {
      res.status(200).json({
        Message: `Add beef ${req.body.product_id} successfully`,
      });
    })
    .catch((e) => {
      res.status(500).json({
        Message: "Add beef failed",
        Error: e,
      });
    });
});

// get beef by id
server.get("/api/beef/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.getBeefProductbyID(product_id)
    .then((bf) => {
      if (bf) {
        res.status(200).json(bf);
      } else {
        res.status(404).json({ Message: `No record of beef ${product_id}` });
      }
    })
    .catch((e) => {
      res
        .status(500)
        .json({ Message: `Unable to get beef ${product_id}`, Error: e });
    });
});

// add journey
server.post("/api/journey", (req, res) => {
  db.addJourney(req.body)
    .then(() => {
      res.status(200).json({
        Message: `Add journey successfully`,
      });
    })
    .catch((e) => {
      res.status(500).json({
        Message: "Add journey failed",
        Error: e,
      });
    });
});

// get journeies by bf id
server.get("/api/journey/:product_id", (req, res) => {
  const { product_id } = req.params;
  db.getJourneiesofBeefProduct(product_id)
    .then((js) => {
      if (js) {
        res.status(200).json(js);
      } else {
        res.status(404).json({ Message: `No record of journey` });
      }
    })
    .catch((e) => {
      res.status(500).json({ Message: `Unable to get journey`, Error: e });
    });
});

// update journey by id
server.patch("/api/journey", (req, res) => {
  const { product_id, user_id, end_date } = req.body;
  db.finishJourney(product_id, user_id, { end_date })
    .then((pid) => {
      if (pid) {
        res.status(200).json({ Message: `Update journey successfully` });
      } else {
        res.status(404).json({ Message: `No record in db` });
      }
    })
    .catch((e) => {
      res.status(500).json({ Message: `No record of journey`, Error: e });
    });
});

//========================== hidden funcs
// // delete user by id
// server.delete("/api/user/:id", (req, res) => {
//   const { id } = req.params;
//   db.deleteUserbyID(id)
//     .then((count) => {
//       if (count > 0) {
//         res.status(200).json({ Message: `Delete user ${id} successfully` });
//       } else {
//         res.status(404).json({ Message: `No record of user ${id}` });
//       }
//     })
//     .catch((e) => {
//       res
//         .status(500)
//         .json({ Message: `Unable to delete user ${id}`, Error: e });
//     });
// });

// // update user by id
// server.patch("/api/user/:id", (req, res) => {
//   const { id } = req.params;
//   const changes = req.body;
//   db.updateUserbyID(id, changes)
//     .then((user) => {
//       if (user) {
//         res.status(200).json({ Message: `Update user ${id} successfully` });
//       } else {
//         res.status(404).json({ Message: `No record of user ${id}` });
//       }
//     })
//     .catch((e) => {
//       res
//         .status(500)
//         .json({ Message: `Unable to update user ${id}`, Error: e });
//     });
// });

// // add doc by user id
// server.post("/api/user/:id_address/document", (req, res) => {
//   const { id_address } = req.params;
//   db.getUserbyID(id_address)
//     .then((user) => {
//       if (!user) {
//         res.status(404).json({ Message: `No record of user ${id_address}` });
//       }
//       const { certification_id } = user;
//       db.getCertificationbyID(certification_id).then((certification) => {
//         if (!certification) {
//           res.status(404).json({
//             Message: `No record of certification ${certification_id} with user ${id_address}`,
//           });
//         }
//         db.addDocument({ ...req.body, certification_id })
//           .then(() => {
//             res.status(200).json({
//               Message: `Add document with user ${id_address} successfully`,
//             });
//           })
//           .catch((e) => {
//             res.status(500).json({
//               Message: `Unable to add document with user ${id_address}`,
//               Error: e,
//             });
//           });
//       });
//     })
//     .catch((e) => {
//       res.status(500).json({
//         Message: `Unable to add document with user ${id_address}`,
//         Error: e,
//       });
//     });
// });

// // get docs by user id
// server.get("/api/user/:id_address/document", (req, res) => {
//   const { id_address } = req.params;
//   db.getUserbyID(id_address)
//     .then((user) => {
//       if (!user) {
//         res.status(404).json({ Message: `No record of user ${id_address}` });
//       }
//       const { certification_id } = user;
//       db.getCertificationbyID(certification_id).then((certification) => {
//         if (!certification) {
//           res.status(404).json({
//             Message: `No record of certification ${certification_id} with user ${id_address}`,
//           });
//         }
//         db.getDocumentsbyCertification(certification_id).then((doc) => {
//           res.status(200).json(doc);
//         });
//       });
//     })
//     .catch((e) => {
//       res.status(500).json({
//         Message: `Unable to get document with user ${id_address}`,
//         Error: e,
//       });
//     });
// });

// // get doc by hash
// server.get("/api/document/:hash_value", (req, res) => {
//   const { hash_value } = req.params;
//   db.getDocumentbyHash(hash_value)
//     .then((doc) => {
//       if (doc) {
//         res.status(200).json(doc);
//       } else {
//         res
//           .status(404)
//           .json({ Message: `No record of document ${hash_value}` });
//       }
//     })
//     .catch((e) => {
//       res
//         .status(500)
//         .json({ Message: `Unable to get document ${hash_value}`, Error: e });
//     });
// });

// // get certification by user id_address
// server.get("/api/user/:id_address/certification", (req, res) => {
//   const { id_address } = req.params;
//   db.getUserbyID(id_address)
//     .then((user) => {
//       if (!user) {
//         res.status(404).json({ Message: `No record of user ${id_address}` });
//       }
//       const { certification_id } = user;
//       db.getCertificationbyID(certification_id)
//         .then((certification) => {
//           if (certification) {
//             res.status(200).json(certification);
//           } else {
//             res.status(404).json({
//               Message: `No record of certification ${certification_id} with user ${id_address}`,
//             });
//           }
//         })
//         .catch((e) => {
//           res.status(500).json({
//             Message: `Unable to get certification with user ${id_address}`,
//             Error: e,
//           });
//         });
//     })
//     .catch((e) => {
//       res.status(500).json({
//         Message: `Unable to get certification with user ${id_address}`,
//         Error: e,
//       });
//     });
// });

// get all users
server.get("/api/user", (req, res) => {
  db.getUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((e) => {
      res.status(500).json({ Message: "Unable to retrieve users", Error: e });
    });
});

// // get all certs
// server.get("/api/certification", (req, res) => {
//   db.getCertifications()
//     .then((certifications) => {
//       res.status(200).json(certifications);
//     })
//     .catch((e) => {
//       res
//         .status(500)
//         .json({ Message: "Unable to retrieve certifications", Error: e });
//     });
// });

// // get all doc
// server.get("/api/document", (req, res) => {
//   db.getDocuments()
//     .then((documents) => {
//       res.status(200).json(documents);
//     })
//     .catch((e) => {
//       res.status(500).json({ Message: "Unable to retrieve docs", Error: e });
//     });
// });
