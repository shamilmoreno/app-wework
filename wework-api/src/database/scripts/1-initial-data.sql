-- CATEGORÍAS
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('pai', 'Países', 'Listado de paises disponibles', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('gen', 'Géneros', 'Lista de géneros disponibles', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('ide', 'Tipos de identidades', 'Tipos de documentos de identidad', false);
-- CATEGORÍAS (Embarques)  
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('dde', 'Descripciones del Embarque', 'Listado de descripciones de Embarques', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('tpe', 'Tipos de embarques', 'Listado de los tipos de Embarques', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('ede', 'Estatus de embarques', 'Listado de los estatus de Embarques', false);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('rle', 'Regimen legales de embarques', 'Listado de Regimen legales de Embarques', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('pde', 'Puertos de entrada para embarques', 'Listado Puertos de Entrda', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('mpe', 'Marcas de productos para embarques', 'Listado Marcas Productos de Embarque', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('gaa', 'Categorías de Gastos Administrativos', 'Listado de tipos de gastos administrativos', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('gan', 'Tipos de gastos de nacionalización', 'Listado de tipos de gastos de nacionalización', true);
-- CATEGORÍAS (Recipe Bolsa)
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('mrb', 'Maquiladores para receta de bolsas', 'Listado maquiladores para receta bolsa', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('tmp', 'Tipos de medidas para los productos','Listado de medidas para los productos', true);
  INSERT INTO "category" ("nem", "name", "description", "editable") VALUES ('ldp', 'Lista de depositos para los productos','Listado de depositos para los productos', true);

-- PAÍSES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Argentina');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'México');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Dubai');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Turquía');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Uruguay');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Bielorrusia');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Nueva Zelanda');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'China');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (1, 'Singapur');

-- GÉNEROS
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (2, 'Masculino');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (2, 'Femenino');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (2, 'No Binario');

-- TIPOS DE IDENTIDADES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (3, 'Venezolano');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (3, 'Pasaporte');

  -- DESCRIPCIONES DE EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (4, 'Leche en polvo (Instantánea)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (4, 'Leche en polvo (Entera Instantánea)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (4, 'Leche desnatada en polvo (Instantánea)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (4, 'Formula Láctea');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (4, 'Concentrador centrifugo de oro móvil');

  -- TIPOS DE EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (5, 'Terrestre');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (5, 'Maritimo');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (5, 'Aereo');

  -- ESTATUS DE EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (6, 'En Transito');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (6, 'Despacho');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (6, 'Llego');

  -- REGIMEN LEGALES DE EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (7, 'Registro Sanitario');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (7, 'Inclusión de nuevo importador');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (7, 'Licencia de importación');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (7, 'CNP');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (7, 'Permiso sanitario de importación');

   -- PUERTOS DE ENTRADA
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (8, 'Maracaibo');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (8, 'La Guaira');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (8, 'Puerto Cabello');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (8, 'Santa Elena de Guairen');

-- MARCA PRODUCTOS DE EMBARQUE
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (9, 'Nestle Argentina');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (9, 'Fonterra (Oackland)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (9, 'Reiny Picot');

-- GASTOS ADMINISTRATIVOS EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (10, 'Alimentación');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (10, 'Salud');

  -- GASTOS NACIONALIZACIÓN EMBARQUES
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Bolipuerto');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Oceanosa Caribeann');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Veconintes');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Base Imponible');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Vargas Containrs');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Gonaris');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'InterShipping');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (11, 'Otros');

-- MAQUILADORES RECIPE BOLSA
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (12, 'Maizal');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (12, 'Evalsa');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (12, 'Xie Yen');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (12, 'Grupo Tatmak');

  --UNIDAD DE MEDIDAS PARA LOS PRODUCTOS
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (13, 'Unidades (Unidad)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (13, 'Kilogramos (Kg)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (13, 'Gramos (Gr)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (13, 'Litros (L)');

   --LISTADO DE DEPOSITOS PARA LOS PRODUCTOS
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (14, 'Deposito Lebrun (Petare)');
  INSERT INTO "subcategory" ("categoryId", "name") VALUES (14, 'deposito Guatire (Guatire)');

-- ROLES
  INSERT INTO "role" ("name", "createdAt") VALUES ('Administrator', '2023-01-10');
  INSERT INTO "role" ("name", "createdAt") VALUES ('Recipe Manager', '2023-01-10');
  INSERT INTO "role" ("name", "createdAt") VALUES ('Inventory Manager', '2023-01-10');
  INSERT INTO "role" ("name", "createdAt") VALUES ('Import Manager', '2023-01-10');

-- PERMISSIONS
  INSERT INTO "permission" ("name", "createdAt") VALUES ('create', '2023-01-10');
  INSERT INTO "permission" ("name", "createdAt") VALUES ('edit', '2023-01-10');
  INSERT INTO "permission" ("name", "createdAt") VALUES ('delete', '2023-01-10');

-- ROLE-PERMISSIONS
  INSERT INTO "role_permission" ("roleId", "permissionId") VALUES (1, 1);
  INSERT INTO "role_permission" ("roleId", "permissionId") VALUES (1, 2);
  INSERT INTO "role_permission" ("roleId", "permissionId") VALUES (1, 3);
  INSERT INTO "role_permission" ("roleId", "permissionId") VALUES (3, 3);

-- USUARIOS
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Shamil', 'Moreno', 'shamilmoreno@gmail.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 10, '2023-01-10');
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Administrator', 'Genral', 'admin@weworkintegrados.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 10, '2023-01-10');
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Elymer', 'Zabala', 'elymer.zabala@weworkintegrados.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 11, '2023-01-10');
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Jeyderment', 'Defitt', 'jeyderment.defitt@weworkintegrados.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 10, '2023-01-10');
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Dimaiscar', 'Gomez', 'dimaiscar.gomez@weworkintegrados.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 10, '2023-01-10');
  INSERT INTO "user" ("firstName", "lastName", "email", "password", "token", "genderId", "createdAt") VALUES ('Kelly', 'Vega', 'kelly.vega@weworkintegrados.com', '$2b$08$udVCQ.E/DMdtzW340oU.X.iJj85Jbq8YzZrWAavLy4mq9bBmhUSP6', null, 11, '2023-01-10');

-- USERS-ROLEs
  INSERT INTO "user_role" ("userId", "roleId") VALUES (1, 1);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (2, 1);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (3, 2);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (4, 2);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (5, 2);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (3, 3);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (4, 3);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (5, 3);
  INSERT INTO "user_role" ("userId", "roleId") VALUES (6, 4);

-- PRODUCTS
  -- RUBRO (Aceite Vegetal de Palma y/o Soya)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('AC-0001', 'Aceite Vegetal de Palma y/o Soya', '/resources/aceite.png
', 57, true, '2024/05/04');
  -- RUBRO (Arroz Blanco Pulido)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('AR-0001', 'Arroz Blanco Pulido', '/resources/arroz.png
', 57, true, '2024/05/04');
  -- RUBRO (Azúcar Refinada)Kg
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('AZ-0001', 'Azúcar Refinada','/resources/azucar.png
', 57, true, '2024/05/04');
  -- RUBRO (Harina de Maiz Blanca Precocida)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('HM-0001', 'Harina de Maiz Blanca Precocida', '/resources/harina-maiz.png
', 57, true, '2024/05/04');
  -- RUBRO (Harina de Maiz Amarilla Precocida)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('HM-0002', 'Harina de Maiz Amarilla Precocida', '/resources/harina-maiz.png
', 57, true, '2024/05/04');
  -- RUBRO (Leguminoza (Caraotas, Arvejas o Lentejas))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('LG-0001', 'Leguminoza (Caraotas, Arvejas o Lentejas)', '/resources/leguminoza.png
', 57, true, '2024/05/04');
  -- RUBRO (Pasta Alimenticia 1Kg)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('PA-0001', 'Pasta Alimenticia 1Kg', '/resources/pasta.png
', 57, true, '2024/05/04');
  -- RUBRO (Pasta Alimenticia 500g)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('PA-0002', 'Pasta Alimenticia 500Gr', '/resources/pasta.png
', 57, true, '2024/05/04');
  -- RUBRO (Sardina en Lata (Presentación 170 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('SD-0001', 'Sardina en Lata (Presentación 170 gr)', '/resources/sardina.jpg
', 57, true, '2024/05/04');
  -- RUBRO (Mortadela en Lata (Presentación 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('MO-0001', 'Mortadela en Lata (Presentación 340 gr)', '/resources/mortadela.jpg
', 57, true, '2024/05/04');
  -- RUBRO (Nutrichicha (Presentación 250 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('NU-0001', 'Nutrichicha (Presentación 250 gr)', '/resources/nutrichicha.jpg
', 57, true, '2024/05/04');
  -- RUBRO (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('CP-0001', 'Carne de Almuerzo (Pollo-Presentación lata 340 gr)', '/resources/carne-almuerzo.png
', 57, true, '2024/05/04');
  -- RUBRO (Carne de Almuerzo (Res-Presentación lata 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('CR-0001', 'Carne de Almuerzo (Res-Presentación lata 340 gr)', '/resources/carne-almuerzo.png
', 57, true, '2024/05/04');
  -- RUBRO (Sal (Presentación 500 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('SA-0001', 'Sal (Presentación 500 gr)', '/resources/sal.png
', 57, true, '2024/05/04');
  -- RUBRO (Caraotas (Presentación 600 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('CA-0001', 'Caraotas (Presentación 600 gr)', '/resources/caraotas.jpg
', 57, true, '2024/05/04');
  -- BOLSA
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive", "createdAt") VALUES ('BS-0000', 'Bolsa', '/resources/bolsa.png
', null, true, '2024/05/04');

  -- INVENTORY STOCK (Aceite Vegetal de Palma y/o Soya)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  1, '2024/05/04');
  -- INVENTORY STOCK (Arroz Blanco Pulido)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  2, '2024/05/04');
  -- INVENTORY STOCK (Azúcar Refinada)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  3, '2024/05/04');
  -- INVENTORY STOCK (Harina de Maiz Blanca Precocida)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  4, '2024/05/04');
  -- INVENTORY STOCK (Harina de Maiz Amarilla Precocida)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  5, '2024/05/04');
  -- INVENTORY STOCK (Leguminoza (Caraotas, Arvejas o Lentejas))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  6, '2024/05/04');
  -- INVENTORY STOCK (Pasta Alimenticia 1Kg)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  7, '2024/05/04');
  -- INVENTORY STOCK (Pasta Alimenticia 500g)
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  8, '2024/05/04');
  -- INVENTORY STOCK (Sardina en Lata (Presentación 170 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  9, '2024/05/04');
  -- INVENTORY STOCK (Mortadela en Lata (Presentación 340 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  10, '2024/05/04');
  -- INVENTORY STOCK (Nutrichicha (Presentación 250 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  11, '2024/05/04');
  -- INVENTORY STOCK (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  12, '2024/05/04');
  -- INVENTORY STOCK (Carne de Almuerzo (Res-Presentación lata 340 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  13, '2024/05/04');
  -- INVENTORY STOCK (Sal (Presentación 500 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  14, '2024/05/04');
  -- INVENTORY STOCK (Caraotas (Presentación 600 gr))
  INSERT INTO "inventory" ("quantityProductStock",  "productId" , "createdAt") VALUES (0,  15, '2024/05/04');

  -- INITIAL MOVEMENT FOR INVENTORY
  --(Aceite)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1 , '2024/02/15');
  -- (Arroz Blanco Pulido)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 2, '2024/02/15');
  -- (Azúcar Refinada)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 3, '2024/02/15');
  -- Harina de Maiz Blanca Precocida)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 4, '2024/02/15');
  -- Harina de Maiz Amarilla Precocida)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 5, '2024/02/15');
  -- (Leguminoza (Caraotas, Arvejas o Lentejas))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 6, '2024/02/15');
  -- (Pasta Alimenticia 1Kg)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 7, '2024/02/15');
  -- (Pasta Alimenticia 500g)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 8, '2024/02/15');
  -- (Sardina en Lata (Presentación 170 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 9, '2024/02/15');
  -- (Mortadela en Lata (Presentación 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 10, '2024/02/15');
  -- (Nutrichicha (Presentación 250 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 11, '2024/02/15');
  -- (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 12, '2024/02/15');
  -- (Carne de Almuerzo (Res-Presentación lata 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 13, '2024/02/15');
  -- (Sal (Presentación 500 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 14, '2024/02/15');
  -- (Caraotas (Presentación 600 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantityProductMoved" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "inventoryStockId", "createdAt") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 15, '2024/02/15');
