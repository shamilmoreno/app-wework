import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import path from 'path';

// Configs
import corsOptions from './core/helpers/cors-options';
import startCronJobs from './core/cron/saveBcvRateCron';
import { checkEnvironment } from './core/middlewares/check-environment';

// Routes
import { AuthRoutes } from './api/authentication/auth.routes';
import { CategoryRoutes } from './api/category/category.routes';
import { IndexRoutes } from './api/index/index.routes';
import { SubcategoryRoutes } from './api/subcategory/subcategory.routes';
import { UserRoutes } from './api/user/user.routes';
import { CustomerRoutes } from './api/customer/customer.routes';
import { CompanyRoutes } from './api/company/company.routes';
import { ExchangeRateRoutes } from './api/exhange-rate/exchange-rate.routes';
import { WareHouseRoutes } from './api/warehouse/warehouse.routes'
import { ProviderRoutes } from './api/provider/provider.routes';
import { ShipmentDataRoutes } from './api/shipment/shipment.routes';
import { SummaryShipmentRoutes } from './api/summary-shipment/summary-shipment.routes';
import { BagRecipeDataRoutes } from './api/bag-recipe/bag-recipe.routes';
import { InventoryRoutes } from './api/inventory/inventory.routes';
import { ProductRoutes } from './api/product/product.routes';
import { RoleRoutes } from './api/role/role.routes';
import { PermissionRoutes } from './api/permission/permission.routes';

/**
 * Servidor principal de la aplicación
 */
class Server {
	public app: Application;

	constructor() {
		this.app = express();
		this.vars();
		this.config();
		this.routes();
		this.database();
		this.start();
	}

	public vars(): void {
		// Loading vars
		const env = checkEnvironment();

		// Settings variables
		console.log('Environment on', env.ENVIRONMENT);
		this.app.set('NODE_PORT', env.NODE_PORT);
		this.app.set('NODE_SERVER', env.NODE_SERVER);
		this.app.set('DB_URI', env.DB_URI);
		this.app.set('DB_SSL', env.DB_SSL);
		this.app.set('DB_SYNCHRONIZE', env.DB_SYNCHRONIZE);
		this.app.set('DB_LOGGING', env.DB_LOGGING);
	}

	public config(): void {
		this.app.use(morgan('dev')); // View HTTP requests by terminal
		this.app.use(express.json({ limit: '1024mb' })); // Accept JSON data on the request and response
		this.app.use(compression()); // Enabled compression
		this.app.use(cors(corsOptions)); // Enabled CORS for another servers
		this.app.use(express.urlencoded({ extended: true })); // Accept HTML forms requests
		this.app.use(express.static(path.join(__dirname, '..', 'public'))); // Public folders
	}

	public routes(): void {
		this.app.use('/', new IndexRoutes().router);
		this.app.use('/auth', new AuthRoutes().router);
		this.app.use('/user', new UserRoutes().router);
		this.app.use('/role', new RoleRoutes().router);
		this.app.use('/permission', new PermissionRoutes().router);
		this.app.use('/customer', new CustomerRoutes().router);
		this.app.use('/company', new CompanyRoutes().router);
		this.app.use('/exchangeRate', new ExchangeRateRoutes().router);
		this.app.use('/warehouse', new WareHouseRoutes().router);
		this.app.use('/provider', new ProviderRoutes().router);
		this.app.use('/category', new CategoryRoutes().router);
		this.app.use('/subcategory', new SubcategoryRoutes().router);
		this.app.use('/shipment', new ShipmentDataRoutes().router);
		this.app.use('/summary-shipment', new SummaryShipmentRoutes().router);
		this.app.use('/bag-recipe', new BagRecipeDataRoutes().router);
		this.app.use('/inventory', new InventoryRoutes().router);
		this.app.use('/product', new ProductRoutes().router);
	}

	public async database(): Promise<void> {
		console.log('Connecting to database');
		try {
			// Create connection to database
			const connection = await createConnection({
				type: 'postgres',
				url: this.app.get('DB_URI'),
				port: 5432,
				synchronize: this.app.get('DB_SYNCHRONIZE'),
				logging: this.app.get('DB_LOGGING'),
				extra: {
					ssl: this.app.get('DB_SSL')
				},
				entities: [path.join(__dirname, 'database', 'entities', '*.js')],
				migrations: [path.join(__dirname, 'database', 'migrations', '*.js')],
				subscribers: [path.join(__dirname, 'database', 'subscribers', '*.js')],

				// Otras configuraciones según sea necesario
			});

			console.log('Database connection established');

			// 🔹 Arranca los cron jobs después de inicializar DB
			startCronJobs();
			console.log('⏰ Cron jobs started');

			// Ahora que la conexión está establecida, puedes ejecutar consultas u otras operaciones aquí
			// Por ejemplo:
			// const result = await connection.getRepository(Sample).findOne(query);
		} catch (error) {
			console.error('Error connecting to the database:', error);
			process.exit(1); // Termina la aplicación con un código de error
		}
	}

	public start(): void {
		const PORT = process.env.PORT || this.app.get('NODE_PORT');
		this.app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		}).on('error', (error: any) => {
			console.error('Error starting the server:', error);
			process.exit(1); // Terminates the application with a failure code
		});
	}
}

// Server instance
const server = new Server();

// Exporting the app
export default server.app;
