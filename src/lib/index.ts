export interface TranslateStringBody {
  original: string;
  key: string;
}

export function stringToTranslateSnakeCase(text: string, translateFile: string): TranslateStringBody {
  const key = text.split(' ').join('_').toLowerCase();
  const translateBody: TranslateStringBody = {
    original: text,
    key: `{{ '${translateFile}.` + key + `' | translate }}`
  };
  return translateBody;
}