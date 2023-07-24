#!/usr/bin/env node
import { writeFileSync } from 'fs';

function init() {
  // Load the configuration schema
  const schema = require('./askit.schema.json');

  // Write the schema to a file
  writeFileSync('askit.schema.json', JSON.stringify(schema, null, 2));

  // Generate an initial configuration
  const initialConfig = {
    $schema: 'askit.schema.json',
  };

  // Write the initial configuration to a file
  writeFileSync('askit.json', JSON.stringify(initialConfig, null, 2));
}

const args = process.argv.slice(2);
if (args.includes('--init')) {
  init();
}
