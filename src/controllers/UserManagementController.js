import UserManagementService from '../services/UserManagementService.js';

class UserManagementController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserManagementService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async addUser(req, res) {
    const { name, userType } = req.body;
    try {
      const newUser = await UserManagementService.addUser(name, userType);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req, res) {
    const { id } = req.params;
    const { name, userType } = req.body;
    try {
      const updatedUser = await UserManagementService.updateUser(id, name, userType);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      await UserManagementService.deleteUser(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default UserManagementController;