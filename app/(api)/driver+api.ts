import { Client } from 'pg'

export async function GET(request: Request) {
	try {
		// Configuração do cliente para conectar ao PostgreSQL usando as variáveis de ambiente
		const client = new Client({
			host: process.env.DB_HOST || 'localhost', // Host configurado no seu Docker
			port: Number(process.env.DB_PORT) || 5432, // Porta do PostgreSQL
			user: process.env.DB_USER || 'admin', // Usuário do banco de dados
			password: process.env.DB_PASSWORD || 'admin', // Senha do banco de dados
			database: process.env.DB_NAME || 'ryde-app_db', // Nome do banco de dados
		})

		// Conectando ao banco de dados
		await client.connect()

		// Executando a consulta para buscar os dados
		const response = await client.query('SELECT * FROM drivers')

		// Fechando a conexão
		await client.end()

		return new Response(JSON.stringify({ data: response.rows }), {
			status: 200,
		})
	} catch (error) {
		console.error('Error fetching drivers:', error)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		})
	}
}
