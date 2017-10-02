
import * as colors from 'colors';
import * as program from 'commander';
import {VelsonEngine} from './engine';

program
  .version('0.1.0')
  .option('-t, --template [value]', 'Path to the Velocity template mapping file. (required)')
  .option('-r, --request [value]', 'Path to request JSON file. (required)')
  .parse(process.argv);

if (program.template && program.request) {
  const engine = new VelsonEngine();
  try {
    engine.initialize(program.template, program.request);
    const transformedOutput = engine.transform();
    console.log(colors.green(JSON.stringify(transformedOutput, null, 2)));
  } catch (error) {
    console.log(error.message);
  }
} else {
  program.outputHelp((txt) => {
    return colors.yellow(txt);
  });
}
