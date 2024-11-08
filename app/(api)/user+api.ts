import { Client } from 'pg'

export async function POST(request: Request) {
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

		// Parseando os dados do request
		const { name, email, clerkId } = await request.json()

		if (!name || !email || !clerkId) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
		}

		// Inserindo os dados no banco de dados
		const queryText = `
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES ($1, $2, $3)
      RETURNING *;
    `
		const values = [name, email, clerkId]

		const response = await client.query(queryText, values)

		// Fechando a conexão
		await client.end()

		return new Response(JSON.stringify({ data: response.rows }), {
			status: 201,
		})
	} catch (error) {
		console.error('Error creating user:', error)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		})
	}
}
