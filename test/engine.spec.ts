import { VelsonEngine } from '../src/engine';

let engine: any;
const testFiles = 'test/resources';

describe('test velson engine', () => {
  beforeAll((done) => {
    engine = new VelsonEngine();
    done();
  });

  test('initialization with missing Velocity template path throws an error', () => {
    expect(() => {
      engine.initialize('', `${testFiles}/sample.json`);
    }).toThrowError(/Velocity template not found/);
  });

  test('initialization with missing request file path throws an error', () => {
    expect(() => {
      engine.initialize(`${testFiles}/template.vm`, '');
    }).toThrowError(/Request file not found/);
  });

  test('initialization with valid paths for template and request file does not throw an error', () => {
    expect(() => {
      engine.initialize(`${testFiles}/template.vm`, `${testFiles}/sample.json`);
    }).not.toThrow();
  });

  test('transform with valid paths for valid template & request returns a JSON-formatted output', () => {
    engine.initialize(`${testFiles}/template.vm`, `${testFiles}/sample.json`);
    const transformedOutput = engine.transform();
    try {
      let output: any;
      output = JSON.parse(JSON.stringify(transformedOutput));
      expect(output).toBeDefined();
    } catch (error) {
      // Intentionally fail test.
      expect(true).toBeFalsy();
    }
  });

  test('transform with template generating bad JSON should throw error', () => {
    engine.initialize(`${testFiles}/badJsonGeneratorTemplate.vm`, `${testFiles}/sample.json`);
    expect(() => {
      const transformedOutput = engine.transform();
    }).toThrow();
  });

  test('transform with an invalid JSON-formatted request file should throw error', () => {
    engine.initialize(`${testFiles}/template.vm`, `${testFiles}/invalidJsonSample.json`);
    expect(() => {
      const transformedOutput = engine.transform();
    }).toThrow();
  });

});
