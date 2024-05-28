const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = `${__dirname}/../migrations`;

class CreateMigration {
  static createMigration(name) {
    const datePrefix = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(" ", "-")
      .replace(/-/g, "")
      .replace(/:/g, "");

    let template = fs
      .readFileSync(`${__dirname}/../templates/CreateMigrationTemplate.js`)
      .toString();
    template = template.replace("Migration {", `Migration${datePrefix} {`);

    const targetDir = MIGRATIONS_DIR;
    if (fs.existsSync(targetDir) === false) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(targetDir, `${datePrefix}-${name}.js`),
      template
    );
  }
}

module.exports = CreateMigration;
