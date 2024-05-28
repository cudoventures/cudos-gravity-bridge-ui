const CreateMigration = require("../utils/CreateMigration");

if (process.argv.length !== 3) {
  console.log(
    "There should be only one command line argument - the name of the migration"
  );
  process.exit(0);
}

CreateMigration.createMigration(process.argv[2]);
