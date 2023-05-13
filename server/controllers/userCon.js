const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET = process.env.SECRET
const bcrypt = require('bcrypt')
const pool = require('../models/db');

//регистрация пользователя
const registration = async (req, res) => {
    try{
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)
        
        const query = {
            text: 'INSERT INTO online_store.users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email ',
            values: [name, email, passwordHash],
          };
        
          const { rows } = await pool.query(query);

        const token = jwt.sign(
            {
              userId: rows[0].id,
            },
            SECRET,
            {
              expiresIn: '10d',
            }
          );      

  // Отправка ответа клиенту
  res.status(201).json({ 
    token, 
    user: rows[0] 
});
} catch (err) {
  console.error(err);
  res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
}
};

//авторизация пользователя
const authorization = async (req, res) => {
    try {
        const { email, password } = req.body;
    щ
        const user = await pool.query(
          'SELECT * FROM online_store.users WHERE email = $1',
          [email]
        );
    
        if (user.rows.length === 0) {
          return res.status(401).json({ error: 'Неверный email или пароль' });
        }
    
        const isPasswordMatch = await bcrypt.compare(
          password,
          user.rows[0].password
        );
    
        if (!isPasswordMatch) {
          return res.status(401).json({ error: 'Неверный email или пароль' });
        }
    
        const token = jwt.sign(
          { userId: user.rows[0].id, 
            email: user.rows[0].email },
          SECRET,
          { expiresIn: '10h' }
        );
    
        res.status(200).json({ token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при входе в систему' });
      }
}

//открытие профиля пользователя
const checkUserInfo = async (req, res) => {
    try {

      //Извлечение токена из запроса
      const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
      if(!token){ 
        res.status(403).json({ error: 'У Вас нет доступа'});}

      //Проверка токена на валидность
      const decoded = jwt.verify(token, SECRET);

      //Извлечение id пользователя из токена
      const userId = decoded.userId;

      //Поиск пользователя в базе данных по id
      const { rows } = await pool.query('SELECT * FROM online_store.users WHERE id=$1', [userId]);

      //Если пользователь не найден
      if (!rows[0]) {
        res.status(404).json({ error: 'Пользователь не найден' });
      }
      //Сравнение id, переданного в токене и извлеченного из базы данных
      if (rows[0].id !== userId) {
        res.status(403).json({ error: 'Доступ запрещен' });
      }

      //Отправка информации о пользователе клиенту
      res.status(200).json(rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении информации о пользователе' });
    }
  };

module.exports = { registration,  authorization, checkUserInfo};
            
  

