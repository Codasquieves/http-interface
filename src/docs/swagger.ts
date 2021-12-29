import { writeFileSync } from "fs";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import YAML from "js-yaml";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";

export const writeSwagger = (title: string, version: string, controllers: Function[], fileName?: string): void => {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas/",
  });

  const storage = getMetadataArgsStorage();

  const spec = routingControllersToSpec(
    storage,
    {
      controllers,
    },
    {
      components: { schemas },
      info: { title, version },
    }
  );

  const swagger = YAML.dump(spec);

  writeFileSync(fileName ?? `${title.toLowerCase()}_${version}.yml`, swagger, {
    encoding: "utf-8",
  });
};
