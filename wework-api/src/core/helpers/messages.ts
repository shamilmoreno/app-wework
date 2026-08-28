export default {
  general: {
    error: 'Ocurrio un error inesperado',
    welcome: 'API trabajando correctamente',
  },
  jwt: {
    tokenExpired: 'Token expirado, por favor vuelva a iniciar sesión',
    tokenInvalid: 'Token inválido, por favor vuelva a iniciar sesión',
    userInvalid: 'Usuario inválido, por favor vuelva a iniciar sesión',
  },
  auth: {
    invalidData: 'Datos inválidos, es necesario los datos de correo electrónico y contraseña',
    invalidInfo: 'Correo electrónico o contraseña inválidos',
    failToCreateToken: 'Ocurrio una falla en la creación del token al usuario',
    logoutSuccess: 'Se cerro sesión exitosamente',
    logoutError: 'Algo fallo al intentar cerrar la sesión',
    invalidPassword: 'Contraseña inválida',
    changePasswordSuccess: 'Se cambio la contraseña con éxito',
    changePasswordError: 'Ocurrio un error al cambiar de contraseña',
    invalidToken: 'Token inválido',
    validToken: 'Token válido',
    verifyTokenError: 'Falla en la verificación del token',
    infoToRequestChangePassword: 'Si tu correo electrónico se encuentra registrado en nuestra base de datos recibirás un correo electrónico con las instrucciones para cambiar tu contraseña',
    invalidEmail: 'Correo electrónico inválido',
  },
  role: {
    roleNotFound: 'Rol no encontrado',
    roleDeleted: 'Rol eliminado con éxito',
    roleUpdated: 'Rol actualizado con éxito',
    roleCreated: 'Datos del Rol guardados con éxito',
    roleDataValidationSuccess: 'Tus datos se validaron correctamente'
  },
  customer: {
    customerNotFound: 'Cliente no encontrado',
    customerDeleted: 'Cliente eliminado con éxito',
    customerUpdated: 'Cliente actualizado con éxito',
    customerCreated: 'Datos empresariales guardados con éxito',
    customerDataValidationSuccess: 'Tus datos se validaron correctamente',
    customerDocumentNumberExists: 'El número de documento ya se encuentra registrado',
    customerEmailExists: 'El correo electrónico ya se encuentra registrado',
    customerAddIdentificationCard: 'Se agrego la cedula con éxito',
  },
  provider: {
    providerNotFound: 'Proveedor no encontrado',
    providerDeleted: 'Proveedor eliminado con éxito',
    providerUpdated: 'Proveedor actualizado con éxito',
    providerCreated: 'Datos del Proveedor guardados con éxito',
    providerDataValidationSuccess: 'Tus datos se validaron correctamente',
    providerNumberExists: 'El número de identificación ya se encuentra registrado',
    providerEmailExists: 'El correo electrónico ya se encuentra registrado',
    providerAddIdentificationCard: 'Se agrego la la identificzción con éxito',
  },
  category: {
    invalidNem: 'El nemónico de la categoría es inválido',
    categoryNotFound: 'Categoría no encontrada',
  },
  subcategory: {
    subcategoryNotFound: 'Subcategoría no encontrada',
    subcategoryNotEditable: 'Subcategoría no editable',
    subcategoryExists: 'La Subcategoría que intenta crear ya existe',
    subcategoryCreated: 'Subcategoría creada con éxito',
    subcategoryUpdated: 'Subcategoría actualizada con éxito',
    subcategoryDeleted: 'Subcategoría eliminada con éxito',
  },
  wareHouse: {
    wareHouseNotFound: 'Almacén no encontrado',
    wareHouseCreated: 'Almacén guardado con éxito',
    wareHouseUpdated: 'Almacén actualizado con éxito',
    wareHouseDeleted: 'Almacén eliminado con éxito',
    wareHouseDetailUpdated: 'Elementos del almacén actualizados con éxito'
  },
  company: {
    companyNotFound: 'Compañia no encontrada',
    companyCreated: 'Compañia guardada con éxito',
    companyUpdated: 'Compañia actualizada con éxito',
    companyDeleted: 'Compañia eliminada con éxito',
    companyDetailUpdated: 'Elementos de la compañia actualizados con éxito'
  },
  foodRecipe: {
    settingNotFound: 'Configuración no encontrada',
    settingUpdated: 'Configuración actualizada con éxito',
  },
  employee: {
    employeeNotFound: 'Empleado no encontrado',
    employeeDeleted: 'Empleado eliminado con éxito',
    employeeUpdated: 'Empleado actualizado con éxito',
    employeeCreated: 'Datos personales guardados con éxito',
    employeeDataValidationBudgetError: 'Tus datos son errados o no posees un presupuesto asociado',
    employeeDataValidationScheduleError: 'Tus datos son errados o no posees una cita para reagendar',
    employeeDataValidationSuccess: 'Tus datos se validaron correctamente',
    employeeDocumentNumberExists: 'El número de documento ya se encuentra registrado',
    employeeEmailExists: 'El correo electrónico ya se encuentra registrado',
  },
  bagRecipe: {
    bagRecipeNotFound: 'Receta no encontrada',
    bagRecipeCreated: 'Receta guardada con éxito',
    bagRecipeUpdated: 'Receta actualizada con éxito',
    bagRecipeDeleted: 'Receta eliminada con éxito',
    bagRecipeDetailUpdated: 'Elementos de la receta actualizados con éxito'
  },
  inventoryStock: {
    inventoryStockNotFound: 'Inventario no encontrada',
    inventoryStockCreated: 'Inventario guardada con éxito',
    inventoryStockUpdated: 'Inventario actualizada con éxito',
    inventoryStockDeleted: 'Inventario eliminada con éxito',
    inventoryStockDetailUpdated: 'Elementos de la Inventario actualizados con éxito',
    inventoryStockNotMovement: 'Stock del Producto sin movimientos',
  },
  maquilador: {
    maquiladorNotFound: 'Maquilador no encontrado',
    maquiladorCreated: 'Maquilador guardado con éxito',
    maquiladorUpdated: 'Maquilador actualizado con éxito',
    maquiladorDeleted: 'Maquilador eliminado con éxito',
    maquiladorDetailUpdated: 'Elementos del Maquilador actualizados con éxito'
  },
  product: {
    productNotFound: 'Producto no encontrado',
    productCreated: 'Producto guardado con éxito',
    productUpdated: 'Producto actualizado con éxito',
    productDeleted: 'Producto eliminado con éxito',
    productDetailUpdated: 'Elementos del Producto actualizados con éxito'
  },
  shipment: {
    shipmentNotFound: 'Embarque no encontrado',
    shipmentCreated: 'Embarque guardado con éxito',
    shipmentUpdated: 'Embarque actualizado con éxito',
    shipmentDeleted: 'Embarque eliminado con éxito',
    shipmentCreatedFromTemplate: 'Embarque creado desde una plantilla',
    shipmentBltNumberExists: 'El número de B/L ya se encuentra registrado',
    shipmentDetailUpdated: 'Elementos del embarque actualizados con éxito',
    shipmentCopy: 'Copia de embarque creada con éxito',
  },
  summaryBagRecipe: {
    summaryBagRecipeSuccess: 'Información obtenida con éxito',
  },
  summaryShipment: {
    summaryShipmentSuccess: 'Información obtenida con éxito',
  },
  exchangeRate: {
    exchangeRateNotFound: 'Tasa no encontrada',
    exchangeRateCreated: 'Tasa guardada con éxito',
    exchangeRateUpdated: 'Tasa actualizada con éxito',
    exchangeRateDeleted: 'Tasa eliminada con éxito',
    exchangeRateDetailUpdated: 'Elementos de la tasa actualizados con éxito'
  },
  upload: {
    imageNotFound: 'Imagen no encontrada',
    logoUpdated: 'Logo actualizado con éxito',
    logoDeleted: 'Logo eliminado con éxito',
  },
  user: {
    userNotFound: 'Usuario no encontrado',
    userCreated: 'Usuario guardado con éxito',
    userUpdated: 'Usuario actualizado con éxito',
    userInfoUpdated: 'Información actualizada con éxito',
    userInfoUpdatedError: 'Hubo un problema al actualizar la información del usuario',
    userDetailUpdated: 'Elementos del embarque actualizados con éxito',
    userEmailtNumberExists: 'El correo ingresado ya se encuentra registrado',
  },
  notification: {
    notificationNotFound: 'Notificación no encontrada',
    notificationUpdated: 'Notificación leída con éxito',
    notificationAllUpdated: 'Notificaciones marcadas como leídas con éxito',
  }
};
