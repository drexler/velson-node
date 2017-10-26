import chalk from 'chalk';  // instead of import * chalk from 'chalk' due to TS definition file issues.
import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import { VelsonEngine } from './engine';
import { VelsonError, ErrorType } from './error';

const packageInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json' )).toString());

program
  .version(packageInfo.version)
  .option('-t, --template [value]', 'Path to the Velocity template mapping file. (required)')
  .option('-r, --request [value]', 'Path to request JSON file. (required)')
  .parse(process.argv);

if (program.template && program.request) {
  const engine = new VelsonEngine();
  try {
    engine.initialize(program.template, program.request);
    const transformedOutput = engine.transform();
    console.log(chalk.greenBright(JSON.stringify(transformedOutput, null, 2)));
  } catch (err) {
    const error = new VelsonError(err.cause.getMessageSync());
    printErrorMessage(error);
  }
} else {
  program.outputHelp((txt) => {
    return chalk.white(txt);
  });
}

function printErrorMessage(error: VelsonError): void {
  if (error.type === ErrorType.Template || error.type === ErrorType.Unknown) {
    console.log(chalk.redBright(error.body));
    return;
  }

  const highlightLine = error.lineNumber + 2;
  const lines = error.body.split('\n');

  let count = 1;
  lines.forEach((line) => {
    if (count !== highlightLine) {
      console.log(chalk.redBright(line));
    } else {
      console.log(chalk.red.bgCyanBright(line));
    }
    count += 1;
  });
}
