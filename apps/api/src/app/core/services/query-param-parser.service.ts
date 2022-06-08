import { MongooseQueryParser } from "mongoose-query-parser";

export function queryParamParser<T>(queryParams: T) {
  const parser = new MongooseQueryParser({
    skipKey: 'offset'
  });

  return parser.parse(queryParams);
}
