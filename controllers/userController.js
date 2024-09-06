const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword});
        res.status(201).json({message: 'Banco de dados conectado com sucesso.'});
    } catch (error) {
        res.status(400).json({error: 'Erro ao conectar com o banco de dados.'});
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({error: 'Credenciais inválidas.'});
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
        res.json({token});
    } catch (error) {
        res.status(400).json({error: 'Erro ao conectar com o banco de dados.'});
    }
};

const listUsers = async (req, res) => {
    try {
        const {username, email} = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user || user.id !== req.userId) {
            return res.status(403).json({error: 'Acesso negado.'});
        }
        user.username = username;
        user.email = email;
        await user.save();
        res.json({message: 'Usuário atualizado com sucesso.'});
    } catch (error) {
        res.status(400).json({error: 'Erro ao atualizar o usuário.'});
    }
};

const updateUser = async (req, res) => {
    try {
      const { username, email } = req.body;
      const user = await User.findByPk(req.params.id);
  
      if (!user || user.id !== req.userId) {
        return res.status(403).json({ error: 'Acesso negado.' });
      }
  
      user.username = username;
      user.email = email;
      await user.save();
      res.json({ message: 'Usuário atualizado com sucesso.' });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar usuário.' });
    }
  };

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user || user.id !== req.userId) {
            return res.status(403).json({error: 'Acesso negado.'});
        }

        await user.destroy();
        res.json({message: 'Usuário deletado com sucesso.'});
    } catch (error) {
        res.status(500).json({error: 'Erro ao deletar o usuário.'});
    }
};

module.exports = {register, login, listUsers, updateUser, deleteUser};