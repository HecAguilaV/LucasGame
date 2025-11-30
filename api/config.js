/**
 * API Endpoint para obtener configuración privada
 * Este endpoint lee la variable de entorno de Vercel y la devuelve de forma segura
 * 
 * En Vercel, este archivo se convierte automáticamente en una serverless function
 */

export default function handler(req, res) {
    // Configurar CORS para permitir peticiones desde el mismo dominio
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Solo permitir GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Obtener número de teléfono desde variable de entorno de Vercel
    // Usamos PHONE_NUMBER (no VERCEL_PHONE_NUMBER porque Vercel reserva nombres con "VERCEL")
    const phoneNumber = process.env.PHONE_NUMBER;

    // Devolver solo el número de teléfono (sin exponer otras configuraciones)
    return res.status(200).json({
        phoneNumber: phoneNumber || null,
        success: !!phoneNumber
    });
}
