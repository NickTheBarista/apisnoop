-- Create
--  #+NAME: api_operation_parameter view

CREATE OR REPLACE VIEW "public"."api_operation_parameter" AS 
  SELECT api_operation.operation_id,
         (param.entry ->> 'name'::text) AS name,
         CASE
         WHEN ((param.entry ->> 'required'::text) = 'true') THEN true
         ELSE false
          END AS required,
         -- for resource:
         -- if param is body in body, take its $ref from its schema
         -- otherwise, take its type
         replace(
           CASE
           WHEN ((param.entry ->> 'in'::text) = 'body'::text) 
            AND ((param.entry -> 'schema'::text) is not null)
             THEN ((param.entry -> 'schema'::text) ->> '$ref'::text)
           ELSE (param.entry ->> 'type'::text)
           END, '#/definitions/','') AS resource,
         (param.entry ->> 'description'::text) AS description,
         (param.entry ->> 'in'::text) AS "in",
         CASE
         WHEN ((param.entry ->> 'uniqueItems'::text) = 'true') THEN true
         ELSE false
         END AS unique_items,
         api_operation.raw_swagger_id
    FROM api_operation
         , jsonb_array_elements(api_operation.parameters) WITH ORDINALITY param(entry, index)
          WHERE api_operation.parameters IS NOT NULL;
