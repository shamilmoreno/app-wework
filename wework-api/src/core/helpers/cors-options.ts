export default {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Origin', 
    'Authorization', 
    'x-warehouse-id' // 👈 AGREGA ESTA LÍNEA AQUÍ
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

