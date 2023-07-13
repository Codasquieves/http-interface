import { writeFileSync } from "fs";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import YAML from "js-yaml";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { defaultMetadataStorage } from "class-transformer/cjs/storage";
import type { MetadataStorage } from "class-transformer/types/MetadataStorage";

export const writeSwagger = (title: string, version: string, controllers: Function[], fileName?: string): void => {
  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage as MetadataStorage,
    refPointerPrefix: "#/components/schemas/",
  });

  const storage = getMetadataArgsStorage();

  const spec = routingControllersToSpec(
    storage,
    {
      controllers,
    },
    {
      components: schemas,
      info: { title, version },
    },
  );

  const swagger = YAML.dump(spec);

  writeFileSync(fileName ?? `${title.toLowerCase()}_${version}.yml`, swagger, {
    encoding: "utf-8",
  });
};
