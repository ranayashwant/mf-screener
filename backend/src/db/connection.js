import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);

try {
  const conn = await pool.getConnection();
  console.log("✅ Connected to MySQL Database");
  conn.release(); 
} catch(error) {
  console.error("❌ Database connection failed:", error.message);
  console.error(error);
}

export default pool;