/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { writeFileSync } from "fs";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import * as YAML from "json-to-pretty-yaml";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

export const writeSwagger = (
  title: string,
  version: string,
  controllers: Function[]
): void => {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas/"
  });

  const storage = getMetadataArgsStorage();

  const spec = routingControllersToSpec(
    storage,
    {
      controllers
    },
    {
      components: { schemas },
      info: { title, version }
    }
  );

  const swagger = YAML.stringify(spec);
  writeFileSync("bank-swagger.yml", swagger, {
    encoding: "utf-8"
  });
}
