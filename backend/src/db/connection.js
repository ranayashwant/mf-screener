import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'mf_screener',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  const conn = await pool.getConnection();
  console.log("✅ Connected to MySQL Database");
  conn.release();
} catch(error) {
  console.error("❌ Database connection failed:", error.message);
}

export default pool;