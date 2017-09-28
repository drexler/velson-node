
import * as program from 'commander';

program
  .version('0.1.0')
  .option('-t, --template', 'Path to the Velocity template mapping file')
  .option('-r, --request', 'Path to request JSON file.')
  .parse(process.argv);
