import { Client } from 'pg'

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const {
			origin_address,
			destination_address,
			origin_latitude,
			origin_longitude,
			destination_latitude,
			destination_longitude,
			ride_time,
			fare_price,
			payment_status,
			driver_id,
			user_id,
		} = body

		// Verificação de campos obrigatórios
		if (
			!origin_address ||
			!destination_address ||
			!origin_latitude ||
			!origin_longitude ||
			!destination_latitude ||
			!destination_longitude ||
			!ride_time ||
			!fare_price ||
			!payment_status ||
			!driver_id ||
			!user_id
		) {
			return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
		}

		// Configuração do cliente para conectar ao PostgreSQL
		const client = new Client({
			host: process.env.DB_HOST || 'localhost', // Host configurado no seu Docker
			port: Number(process.env.DB_PORT) || 5432, // Porta do PostgreSQL
			user: process.env.DB_USER || 'admin', // Usuário do banco de dados
			password: process.env.DB_PASSWORD || 'admin', // Senha do banco de dados
			database: process.env.DB_NAME || 'ryde-app_db', // Nome do banco de dados
		})

		// Conectando ao banco de dados
		await client.connect()

		// Inserção dos dados no banco de dados
		const queryText = `
      INSERT INTO rides (
        origin_address, 
        destination_address, 
        origin_latitude, 
        origin_longitude, 
        destination_latitude, 
        destination_longitude, 
        ride_time, 
        fare_price, 
        payment_status, 
        driver_id, 
        user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `
		const values = [
			origin_address,
			destination_address,
			origin_latitude,
			origin_longitude,
			destination_latitude,
			destination_longitude,
			ride_time,
			fare_price,
			payment_status,
			driver_id,
			user_id,
		]

		const response = await client.query(queryText, values)

		// Fechando a conexão
		await client.end()

		return new Response(JSON.stringify({ data: response.rows[0] }), {
			status: 201,
		})
	} catch (error) {
		console.error('Error inserting data into rides:', error)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		})
	}
}
