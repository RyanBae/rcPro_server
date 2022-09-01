module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root", // mysql 초기 설정한 비밀번호
    DB: "h_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
