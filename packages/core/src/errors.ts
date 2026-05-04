export const CANCEL_EXIT_CODE = 130;
export const USAGE_EXIT_CODE = 2;

export class CommandCancelledError extends Error {
  constructor(message = "Operation cancelled.") {
    super(message);
    this.name = "CommandCancelledError";
  }
}

export class NonInteractivePromptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonInteractivePromptError";
  }
}
