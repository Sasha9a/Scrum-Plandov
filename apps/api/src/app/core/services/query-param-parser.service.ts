import { SortOrder } from 'mongoose';
import { MongooseQueryParser } from 'mongoose-query-parser';

export function queryParamParser<T>(queryParams: T) {
  const parser = new MongooseQueryParser({
    skipKey: 'offset'
  });

  return parser.parse(queryParams);
}

export function parseSortToMongo(sort: string): { [p: string]: SortOrder } | null {
  if (!sort) {
    return null;
  }

  const result = {};
  let fieldName = sort.split(':')[0];
  let positive = 1;

  if (fieldName[0] === '-') {
    positive = -1;
    fieldName = fieldName.slice(1);
  }
  result[fieldName] = positive;
  return result;
}
