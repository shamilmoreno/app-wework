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

-- ESTADOS
  INSERT INTO "state" ("id", "name") VALUES (1, 'Amazonas');
  INSERT INTO "state" ("id", "name") VALUES (2, 'Anzoátegui');
  INSERT INTO "state" ("id", "name") VALUES (3, 'Apure');
  INSERT INTO "state" ("id", "name") VALUES (4, 'Aragua');
  INSERT INTO "state" ("id", "name") VALUES (5, 'Barinas');
  INSERT INTO "state" ("id", "name") VALUES (6, 'Bolívar');
  INSERT INTO "state" ("id", "name") VALUES (7, 'Carabobo');
  INSERT INTO "state" ("id", "name") VALUES (8, 'Cojedes');
  INSERT INTO "state" ("id", "name") VALUES (9, 'Delta Amacuro');
  INSERT INTO "state" ("id", "name") VALUES (10, 'Falcón');
  INSERT INTO "state" ("id", "name") VALUES (11, 'Guárico');
  INSERT INTO "state" ("id", "name") VALUES (12, 'Lara');
  INSERT INTO "state" ("id", "name") VALUES (13, 'Mérida');
  INSERT INTO "state" ("id", "name") VALUES (14, 'Miranda');
  INSERT INTO "state" ("id", "name") VALUES (15, 'Monagas');
  INSERT INTO "state" ("id", "name") VALUES (16, 'Nueva Esparta');
  INSERT INTO "state" ("id", "name") VALUES (17, 'Portuguesa');
  INSERT INTO "state" ("id", "name") VALUES (18, 'Sucre');
  INSERT INTO "state" ("id", "name") VALUES (19, 'Táchira');
  INSERT INTO "state" ("id", "name") VALUES (20, 'Trujillo');
  INSERT INTO "state" ("id", "name") VALUES (21, 'Yaracuy');
  INSERT INTO "state" ("id", "name") VALUES (22, 'Zulia');
  INSERT INTO "state" ("id", "name") VALUES (23, 'La Guaira');
  INSERT INTO "state" ("id", "name") VALUES (24, 'Distrito Capital');

  -- CIUDADES
  -- Distrito Capital
  INSERT INTO "city" ("stateId", "name") VALUES (24, 'Caracas');

  -- Miranda
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Los Teques');
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Guarenas');
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Guatire');
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Petare');
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Charallave');
  INSERT INTO "city" ("stateId", "name") VALUES (14, 'Ocumare del Tuy');

  -- La Guaira
  INSERT INTO "city" ("stateId", "name") VALUES (23, 'La Guaira');
  INSERT INTO "city" ("stateId", "name") VALUES (23, 'Catia La Mar');
  INSERT INTO "city" ("stateId", "name") VALUES (23, 'Maiquetía');

  -- Carabobo
  INSERT INTO "city" ("stateId", "name") VALUES (7, 'Valencia');
  INSERT INTO "city" ("stateId", "name") VALUES (7, 'Naguanagua');
  INSERT INTO "city" ("stateId", "name") VALUES (7, 'San Diego');
  INSERT INTO "city" ("stateId", "name") VALUES (7, 'Puerto Cabello');
  INSERT INTO "city" ("stateId", "name") VALUES (7, 'Guacara');

  -- Aragua
  INSERT INTO "city" ("stateId", "name") VALUES (4, 'Maracay');
  INSERT INTO "city" ("stateId", "name") VALUES (4, 'Turmero');
  INSERT INTO "city" ("stateId", "name") VALUES (4, 'La Victoria');
  INSERT INTO "city" ("stateId", "name") VALUES (4, 'Cagua');

  -- Zulia
  INSERT INTO "city" ("stateId", "name") VALUES (22, 'Maracaibo');
  INSERT INTO "city" ("stateId", "name") VALUES (22, 'Cabimas');
  INSERT INTO "city" ("stateId", "name") VALUES (22, 'Ciudad Ojeda');
  INSERT INTO "city" ("stateId", "name") VALUES (22, 'San Francisco');

  -- Lara
  INSERT INTO "city" ("stateId", "name") VALUES (12, 'Barquisimeto');
  INSERT INTO "city" ("stateId", "name") VALUES (12, 'Cabudare');
  INSERT INTO "city" ("stateId", "name") VALUES (12, 'Carora');

  -- Anzoátegui
  INSERT INTO "city" ("stateId", "name") VALUES (2, 'Barcelona');
  INSERT INTO "city" ("stateId", "name") VALUES (2, 'Puerto La Cruz');
  INSERT INTO "city" ("stateId", "name") VALUES (2, 'Lechería');
  INSERT INTO "city" ("stateId", "name") VALUES (2, 'El Tigre');

  -- Bolívar
  INSERT INTO "city" ("stateId", "name") VALUES (6, 'Ciudad Guayana');
  INSERT INTO "city" ("stateId", "name") VALUES (6, 'Puerto Ordaz');
  INSERT INTO "city" ("stateId", "name") VALUES (6, 'San Félix');
  INSERT INTO "city" ("stateId", "name") VALUES (6, 'Ciudad Bolívar');

  -- Portuguesa
  INSERT INTO "city" ("stateId", "name") VALUES (17, 'Acarigua');
  INSERT INTO "city" ("stateId", "name") VALUES (17, 'Araure');
  INSERT INTO "city" ("stateId", "name") VALUES (17, 'Guanare');

  -- Táchira
  INSERT INTO "city" ("stateId", "name") VALUES (19, 'San Cristóbal');
  INSERT INTO "city" ("stateId", "name") VALUES (19, 'Rubio');
  INSERT INTO "city" ("stateId", "name") VALUES (19, 'Táriba');

  -- Mérida
  INSERT INTO "city" ("stateId", "name") VALUES (13, 'Mérida');
  INSERT INTO "city" ("stateId", "name") VALUES (13, 'El Vigía');

  -- Monagas
  INSERT INTO "city" ("stateId", "name") VALUES (15, 'Maturín');

  -- Sucre
  INSERT INTO "city" ("stateId", "name") VALUES (18, 'Cumaná');
  INSERT INTO "city" ("stateId", "name") VALUES (18, 'Carúpano');

  -- Falcón
  INSERT INTO "city" ("stateId", "name") VALUES (10, 'Punto Fijo');
  INSERT INTO "city" ("stateId", "name") VALUES (10, 'Coro');

  -- Guárico
  INSERT INTO "city" ("stateId", "name") VALUES (11, 'San Juan de los Morros');
  INSERT INTO "city" ("stateId", "name") VALUES (11, 'Calabozo');

  -- Barinas
  INSERT INTO "city" ("stateId", "name") VALUES (5, 'Barinas');

  -- Trujillo
  INSERT INTO "city" ("stateId", "name") VALUES (20, 'Trujillo');
  INSERT INTO "city" ("stateId", "name") VALUES (20, 'Valera');

  -- Yaracuy
  INSERT INTO "city" ("stateId", "name") VALUES (21, 'San Felipe');

  -- Cojedes
  INSERT INTO "city" ("stateId", "name") VALUES (8, 'San Carlos');

  -- Apure
  INSERT INTO "city" ("stateId", "name") VALUES (3, 'San Fernando de Apure');

  -- Nueva Esparta
  INSERT INTO "city" ("stateId", "name") VALUES (16, 'Porlamar');
  INSERT INTO "city" ("stateId", "name") VALUES (16, 'Pampatar');

  -- Delta Amacuro
  INSERT INTO "city" ("stateId", "name") VALUES (9, 'Tucupita');

  -- Amazonas
  INSERT INTO "city" ("stateId", "name") VALUES (1, 'Puerto Ayacucho');

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

  -- WARE HOUSE
  INSERT INTO "ware_house" ("code", "name", "address", "description", "stateId", "cityId", "isActive") VALUES ('ALM-MIR-PETARE', 'DEPOSITO LEBRUM PETARE','Petare', 'Almacen Primario', 24, 1, true);
  INSERT INTO "ware_house" ("code", "name", "address", "description", "stateId", "cityId", "isActive") VALUES ('ALM-CCS-GUATIRE', 'DEPOSITO GRUPO TATMAK','Guatire', 'Almacen secundario', 14, 4, true);

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

  -- USERS-WAREHOUSE
  INSERT INTO "user_warehouse" ("userId", "warehouseId") VALUES (1, 1);
  INSERT INTO "user_warehouse" ("userId", "warehouseId") VALUES (2, 2);

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
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('AC-0001', 'Aceite Vegetal de Palma y/o Soya', '/resources/aceite.png', 55, true);
  -- RUBRO (Arroz Blanco Pulido)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('AR-0001', 'Arroz Blanco Pulido', '/resources/products/Arroz-Blanco-1Kg.png', 53, true);
  -- RUBRO (Azúcar Refinada)Kg
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('AZ-0001', 'Azúcar Refinada','/resources/products/Azucar-1Kg.png', 53, true);
  -- RUBRO (Harina de Maiz Blanca Precocida)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('HM-0001', 'Harina de Maiz Blanca Precocida', '/resources/products/Harina-Blanca-1Kg.png', 53, true);
  -- RUBRO (Harina de Maiz Amarilla Precocida)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('HM-0002', 'Harina de Maiz Amarilla Precocida', '/resources/products/Harina-Amarilla-1Kg.png', 53, true);
  -- RUBRO (Leguminoza (Caraotas, Arvejas o Lentejas))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('LG-0001', 'Leguminoza (Caraotas, Arvejas o Lentejas)', '/resources/leguminoza.png', 53, true);
  -- RUBRO (Pasta Alimenticia 1Kg)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('PA-0001', 'Pasta Alimenticia 1Kg', '/resources/products/Pasta-1Kg.png', 53, true);
  -- RUBRO (Pasta Alimenticia 500g)
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('PA-0002', 'Pasta Alimenticia 500Gr', '/resources/products/Pasta-500g.png', 54, true);
  -- RUBRO (Sardina en Lata (Presentación 170 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('SD-0001', 'Sardina en Lata (Presentación 170 gr)', '/resources/sardina.jpg', 52, true);
  -- RUBRO (Mortadela en Lata (Presentación 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('MO-0001', 'Mortadela en Lata (Presentación 340 gr)', '/resources/mortadela.jpg', 52, true);
  -- RUBRO (Nutrichicha (Presentación 250 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('NU-0001', 'Nutrichicha (Presentación 250 gr)', '/resources/products/Nutrichicha-250g.png', 54, true);
  -- RUBRO (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('CP-0001', 'Carne de Almuerzo (Pollo-Presentación lata 340 gr)', '/resources/carne-almuerzo.png', 52, true);
  -- RUBRO (Carne de Almuerzo (Res-Presentación lata 340 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('CR-0001', 'Carne de Almuerzo (Res-Presentación lata 340 gr)', '/resources/carne-almuerzo.png', 52, true);
  -- RUBRO (Sal (Presentación 500 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('SA-0001', 'Sal (Presentación 500 gr)', '/resources/products/Sal-500g.png', 53, true);
  -- RUBRO (Caraotas (Presentación 600 gr))
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('CA-0001', 'Caraotas (Presentación 600 gr)', '/resources/products/Caraotas-600g.png', 53, true);
  -- BOLSA
  INSERT INTO "product" ("sku", "name", "imageUrl", "unitMeasurecId", "isActive") VALUES ('BS-0000', 'Bolsa', '/resources/bolsa.png', null, true);

  -- INVENTORY STOCK (Aceite Vegetal de Palma y/o Soya)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 1);
  -- INVENTORY STOCK (Arroz Blanco Pulido)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 2);
  -- INVENTORY STOCK (Azúcar Refinada)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 3);
  -- INVENTORY STOCK (Harina de Maiz Blanca Precocida)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 4);
  -- INVENTORY STOCK (Harina de Maiz Amarilla Precocida)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 5);
  -- INVENTORY STOCK (Leguminoza (Caraotas, Arvejas o Lentejas))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 6);
  -- INVENTORY STOCK (Pasta Alimenticia 1Kg)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 7);
  -- INVENTORY STOCK (Pasta Alimenticia 500g)
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 8);
  -- INVENTORY STOCK (Sardina en Lata (Presentación 170 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 9);
  -- INVENTORY STOCK (Mortadela en Lata (Presentación 340 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 10);
  -- INVENTORY STOCK (Nutrichicha (Presentación 250 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 11);
  -- INVENTORY STOCK (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 12);
  -- INVENTORY STOCK (Carne de Almuerzo (Res-Presentación lata 340 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 13);
  -- INVENTORY STOCK (Sal (Presentación 500 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 14);
  -- INVENTORY STOCK (Caraotas (Presentación 600 gr))
  INSERT INTO "inventory_stock" ("quantity", "warehouseId", "productId") VALUES (0, 1, 15);

  -- INITIAL MOVEMENT FOR INVENTORY
  --(Aceite)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 1);
  -- (Arroz Blanco Pulido)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 2);
  -- (Azúcar Refinada)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 3);
  -- Harina de Maiz Blanca Precocida)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 4);
  -- Harina de Maiz Amarilla Precocida)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 5);
  -- (Leguminoza (Caraotas, Arvejas o Lentejas))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 6);
  -- (Pasta Alimenticia 1Kg)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 7);
  -- (Pasta Alimenticia 500g)
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 8);
  -- (Sardina en Lata (Presentación 170 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 9);
  -- (Mortadela en Lata (Presentación 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 10);
  -- (Nutrichicha (Presentación 250 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 11);
  -- (Carne de Almuerzo (Pollo-Presentación lata 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 12);
  -- (Carne de Almuerzo (Res-Presentación lata 340 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 13);
  -- (Sal (Presentación 500 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 14);
  -- (Caraotas (Presentación 600 gr))
   INSERT INTO "inventory_movement" ("guideNumber",  "quantity" , "date", "destination", "description", "responsibleUser", "stockAfterMovement", "movementType", "referenceType", "referenceId", "warehouseId", "productId") VALUES ('Registro Inicial',  0, '2024/05/04', 'Apertura de Stock', 'Registro inicial del producto en inventario con stock asignado en cero unidades.', 'Shamil Moreno', 0, 'OPENING', 'InitialLoad', null, 1, 15);
