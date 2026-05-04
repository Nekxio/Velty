export interface PromptOption<TValue extends string> {
  readonly label: string;
  readonly value: TValue;
  readonly hint?: string;
}

export interface TextPromptOptions {
  readonly message: string;
  readonly placeholder?: string;
  readonly initialValue?: string;
  readonly validate?: (value: string | undefined) => string | Error | undefined;
}

export interface ConfirmPromptOptions {
  readonly message: string;
  readonly initialValue?: boolean;
}

export interface SelectPromptOptions<TValue extends string> {
  readonly message: string;
  readonly options: ReadonlyArray<PromptOption<TValue>>;
  readonly initialValue?: TValue;
}

export interface MultiselectPromptOptions<TValue extends string> {
  readonly message: string;
  readonly options: ReadonlyArray<PromptOption<TValue>>;
  readonly initialValues?: ReadonlyArray<TValue>;
  readonly required?: boolean;
}

export interface PromptAdapter {
  readonly isInteractive: boolean;
  text(options: TextPromptOptions): Promise<string>;
  confirm(options: ConfirmPromptOptions): Promise<boolean>;
  select<TValue extends string>(options: SelectPromptOptions<TValue>): Promise<TValue>;
  multiselect<TValue extends string>(options: MultiselectPromptOptions<TValue>): Promise<ReadonlyArray<TValue>>;
}
