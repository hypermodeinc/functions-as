// @ts-expect-error: decorator
@external("hypermode", "log")
declare function logToHypermode(level: string, message: string): void;

// @ts-expect-error: decorator
@lazy const timers = new Map<string, u64>();

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace hypermode_console {
  export function assert<T>(condition: T, message: string = ""): void {
    if (!condition) {
      logToHypermode("error", "Assertion failed: " + message);
    }
  }

  export function log(message: string = ""): void {
    logToHypermode("", message);
  }

  export function debug(message: string = ""): void {
    logToHypermode("debug", message);
  }

  export function info(message: string = ""): void {
    logToHypermode("info", message);
  }

  export function warn(message: string = ""): void {
    logToHypermode("warning", message);
  }

  export function error(message: string = ""): void {
    logToHypermode("error", message);
  }

  export function time(label: string = "default"): void {
    const now = process.hrtime();
    if (timers.has(label)) {
      const msg = `Label '${label}' already exists for console.time()`;
      warn(msg);
      return;
    }
    timers.set(label, now);
  }

  export function timeLog(label: string = "default"): void {
    const now = process.hrtime();
    if (!timers.has(label)) {
      const msg = `No such label '${label}' for console.timeLog()`;
      warn(msg);
      return;
    }
    timeLogImpl(label, now);
  }

  export function timeEnd(label: string = "default"): void {
    const now = process.hrtime();
    if (!timers.has(label)) {
      const msg = `No such label '${label}' for console.timeEnd()`;
      warn(msg);
      return;
    }
    timeLogImpl(label, now);
    timers.delete(label);
  }
}

function timeLogImpl(label: string, now: u64): void {
  const start = timers.get(label);
  const nanos = now - start;
  const millis = nanos / 1000000;
  hypermode_console.log(`${label}: ${millis}ms`);
}
