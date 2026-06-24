import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mf_screener',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try{
    const conn = await pool.getConnection();
    console.log("✅ connected to MySQL database");
    conn.release();
}
catch(error){
    console.error("❌ Error connecting to MySQL database:", error.message);
}

export default pool;