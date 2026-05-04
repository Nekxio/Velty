import {
  confirm as clackConfirm,
  multiselect as clackMultiselect,
  select as clackSelect,
  text as clackText,
  isCancel,
  type Option as ClackOption
} from "@clack/prompts";
import {
  CommandCancelledError,
  isCiEnvironment,
  NonInteractivePromptError,
  type ConfirmPromptOptions,
  type MultiselectPromptOptions,
  type PromptAdapter,
  type SelectPromptOptions,
  type TextPromptOptions
} from "@velty/core";

export interface PromptAdapterOptions {
  readonly env?: NodeJS.ProcessEnv;
}

export class ClackPromptAdapter implements PromptAdapter {
  readonly isInteractive: boolean;

  constructor(options: PromptAdapterOptions = {}) {
    const env = options.env ?? process.env;
    this.isInteractive = !isCiEnvironment(env);
  }

  async text(options: TextPromptOptions): Promise<string> {
    this.assertInteractive(options.message);
    const result = await clackText({
      message: options.message,
      ...(options.placeholder !== undefined && {
        placeholder: options.placeholder
      }),
      ...(options.initialValue !== undefined && {
        initialValue: options.initialValue
      }),
      ...(options.validate !== undefined && { validate: options.validate })
    });
    return this.unwrapString(result);
  }

  async confirm(options: ConfirmPromptOptions): Promise<boolean> {
    this.assertInteractive(options.message);
    const result = await clackConfirm({
      message: options.message,
      ...(options.initialValue !== undefined && {
        initialValue: options.initialValue
      })
    });
    return this.unwrapBoolean(result);
  }

  async select<TValue extends string>(options: SelectPromptOptions<TValue>): Promise<TValue> {
    this.assertInteractive(options.message);
    const result = await clackSelect<TValue>({
      message: options.message,
      options: options.options.map(({ label, value, hint }) => ({
        label,
        value,
        ...(hint !== undefined && { hint })
      })) as Array<ClackOption<TValue>>,
      ...(options.initialValue !== undefined && {
        initialValue: options.initialValue
      })
    });
    return this.unwrapValue(result);
  }

  async multiselect<TValue extends string>(options: MultiselectPromptOptions<TValue>): Promise<ReadonlyArray<TValue>> {
    this.assertInteractive(options.message);
    const result = await clackMultiselect<TValue>({
      message: options.message,
      options: options.options.map(({ label, value, hint }) => ({
        label,
        value,
        ...(hint !== undefined && { hint })
      })) as Array<ClackOption<TValue>>,
      ...(options.initialValues !== undefined && {
        initialValues: [...options.initialValues]
      }),
      ...(options.required !== undefined && { required: options.required })
    });
    return this.unwrapValue(result);
  }

  private assertInteractive(message: string): void {
    if (!this.isInteractive) {
      throw new NonInteractivePromptError(`Interactive prompt blocked in CI: ${message}. Pass flags explicitly.`);
    }
  }

  private unwrapString(value: string | symbol): string {
    if (isCancel(value)) {
      throw new CommandCancelledError();
    }
    return value as string;
  }

  private unwrapBoolean(value: boolean | symbol): boolean {
    if (isCancel(value)) {
      throw new CommandCancelledError();
    }
    return value as boolean;
  }

  private unwrapValue<TValue>(value: TValue | symbol): TValue {
    if (isCancel(value)) {
      throw new CommandCancelledError();
    }
    return value as TValue;
  }
}

export const createPromptAdapter = (options: PromptAdapterOptions = {}): PromptAdapter =>
  new ClackPromptAdapter(options);
