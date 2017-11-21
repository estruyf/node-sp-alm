export default class Logger {
  private static _verbose: boolean = false;
  
  public static init(verbose: boolean) {
    Logger._verbose = verbose;
  }
  
  public static info(msg: string) {
    if (Logger._verbose) {
      console.info(`INFO: ${msg}`);
    }
  }
  
  public static warning(msg: string) {
    if (Logger._verbose) {
      console.warn(`WARNING: ${msg}`);
    }
  }
  
  public static error(msg: string) {
    if (Logger._verbose) {
      console.error(`ERROR: ${msg}`);
    }
  }
}