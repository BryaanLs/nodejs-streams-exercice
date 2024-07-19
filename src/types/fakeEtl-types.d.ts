type OrdeningDataFn = (
  chunk: Record<string, string>,
  letters: string[]
) => Record<string, string> | false;

type OrdeningObjects = Record<string, string>;
