import * as fileExists from 'file-exists';
import * as java from 'java';
import * as path from 'path';

/**
 * Class representing the Velson Engine
 *
 * @author drexler
 */
export class VelsonEngine {

  private templatePath: string;
  private requestFilePath: string;
  private internalEngine: any;
  private mode: any;

  /**
   * Creates an instance of the Velson Engine
   */
  public constructor() {
    java.classpath.push(path.resolve(__dirname, '../jars/velocity-1.7-custom.jar'));
    java.classpath.push(path.resolve(__dirname, '../jars/velson-0.1.0.jar '));
    this.internalEngine = java.import('com.drexler.velson.VelsonEngine');
    this.mode = java.import('com.drexler.velson.ResourceLocale');
  }

  /**
   * Initializes the Velson Engine with its require parameters
   * @param {string} templatePath - The path to the Velocity Template file.
   * @param {string} requestFilePath - The path to the request/response JSON-formatted file
   * @throws Will throw an error if the either provided path is invalid
   */
  public initialize(templatePath: string, requestFilePath: string): void {
    if (fileExists.sync(templatePath) && fileExists.sync(requestFilePath)) {
      this.templatePath = templatePath;
      this.requestFilePath = requestFilePath;
    }

    if (!fileExists.sync(templatePath)) {
      throw new Error(`Velocity template not found: ${templatePath}`);
    }

    if (!fileExists.sync(requestFilePath)) {
      throw new Error(`Request file not found: ${requestFilePath}`);
    }
  }

  /**
   * Performs a transformation
   * @return {object} - A JSON-formatted output
   * @throws Will throw an error if the generated output is malformed JSON
   */
  public transform(): object {
    this.internalEngine = new this.internalEngine(this.mode.fileSystem, this.templatePath, this.requestFilePath);
    const output = this.internalEngine.transformSync();
    return JSON.parse(output.toString());
  }

}
