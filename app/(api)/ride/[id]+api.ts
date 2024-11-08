import { Client } from 'pg'

export async function GET(request: Request, { id }: { id: string }) {
	if (!id) {
		return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
	}

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

		// Executando a consulta
		const queryText = `
      SELECT
        rides.ride_id,
        rides.origin_address,
        rides.destination_address,
        rides.origin_latitude,
        rides.origin_longitude,
        rides.destination_latitude,
        rides.destination_longitude,
        rides.ride_time,
        rides.fare_price,
        rides.payment_status,
        rides.created_at,
        'driver', json_build_object(
          'driver_id', drivers.id,
          'first_name', drivers.first_name,
          'last_name', drivers.last_name,
          'profile_image_url', drivers.profile_image_url,
          'car_image_url', drivers.car_image_url,
          'car_seats', drivers.car_seats,
          'rating', drivers.rating
        ) AS driver 
      FROM 
        rides
      INNER JOIN
        drivers ON rides.driver_id = drivers.id
      WHERE 
        rides.user_id = $1
      ORDER BY 
        rides.created_at DESC;
    `
		const values = [id]

		const response = await client.query(queryText, values)

		// Fechando a conexão
		await client.end()

		return new Response(JSON.stringify({ data: response.rows }), {
			status: 200,
		})
	} catch (error) {
		console.error('Error fetching recent rides:', error)
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
		})
	}
}
