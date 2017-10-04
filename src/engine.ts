import * as fileExists from 'file-exists';
import * as java from 'java';

/**
 * Represents an instance of the Velson Engine
 *
 * @author drexler
 */

export class VelsonEngine {

  private templatePath: string;
  private requestFilePath: string;
  private internalEngine: any;
  private mode: any;

  public constructor() {
    java.classpath.push('./lib/velocity-1.7-custom.jar');
    java.classpath.push('./lib/velson-0.1.0.jar');
    this.internalEngine = java.import('com.drexler.velson.VelsonEngine');
    this.mode = java.import('com.drexler.velson.ResourceLocale');
  }

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

  public transform(): object {
    this.internalEngine = new this.internalEngine(this.mode.fileSystem, this.templatePath, this.requestFilePath);
    const output = this.internalEngine.transformSync();
    return JSON.parse(output.toString());
  }

}
