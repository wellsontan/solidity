// Make changes of the tables
exports.up = function (knex) {
  return knex.schema

    .createTable("user", (table) => {
      table.string("id_address").primary();
      table.string("name");
      table.string("type");
      table.string("location");
      table.string("certifier");
      table.string("document_hash");
      table.boolean("valid_status").defaultTo(true);
    })

    .createTable("beef_product", (table) => {
      table.string("product_id").primary();
      table
        .string("farmer_id")
        .unique()
        .notNullable()
        .references("id_address")
        .inTable("user")
        .onDelete("CASCADE"); // foreign key to user table
      table.integer("price");
      table.string("tier");
      table.string("expiry_date");
    })

    .createTable("journey", (table) => {
      table
        .string("product_id")
        .notNullable()
        .references("product_id")
        .inTable("beef_product")
        .onDelete("CASCADE"); // foreign key to beef table
      table
        .string("user_id")
        .notNullable()
        .references("id_address")
        .inTable("user")
        .onDelete("CASCADE"); // foreign key to user table
      table.string("start_date");
      table.string("end_date");
      table.string("produce_info");
    });

  // .createTable("certification", (table) => {
  //   table.increments(); // id
  //   // table.string("sc_address").notNullable();
  //   table.string("certifier").notNullable();
  // })

  // .createTable("document", (table) => {
  //   table.string("hash_value").primary();
  //   table.binary("document").notNullable();
  //   table
  //     .integer("certification_id")
  //     .unsigned()
  //     .notNullable()
  //     .references("id")
  //     .inTable("certification")
  //     .onDelete("CASCADE"); // foreign key to certification table
  // });
};

// Undo changes of the tables
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("journey")
    .dropTableIfExists("beef_product")
    .dropTableIfExists("user");
};
