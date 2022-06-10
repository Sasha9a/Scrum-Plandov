import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export function validate(data: any, dto: any): { valid: boolean, errors?: any } {

  const result: any = plainToInstance(dto, data);

  const resultErrors = {};

  const errors = validateSync(result);

  if (errors.length > 0) {
    errors.map((error) => {

      if (error.property && !resultErrors[error.property]) {
        resultErrors[error.property] = [];
      }

      if (error.constraints) {
        Object.keys(error.constraints).map((name) => {
          resultErrors[error.property].push(error.constraints?.[name]);
        });
      }

      if (error.children?.length) {
        error.children.forEach((childError) => {
          resultErrors[error.property][childError.property] = {};
          childError.children?.forEach((child) => {
            let errorsArray: any[] = resultErrors[error.property][childError.property][child.property] = [];
            if (child.property && !errorsArray) {
              errorsArray = [];
            }
            if (child.constraints) {
              Object.keys(child.constraints).forEach(constraintName => errorsArray.push(child.constraints?.[constraintName]));
            }
          });
        });
      }
    });

    return { valid: false, errors: resultErrors };
  }

  return { valid: true };
}
