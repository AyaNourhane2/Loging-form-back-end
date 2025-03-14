import UserManagementModel from '../models/UserManagementModel.js';

class UserManagementService {
  static async getAllUsers() {
    return await UserManagementModel.getAllUsers();
  }

  static async addUser(name, userType) {
    return await UserManagementModel.addUser(name, userType);
  }

  static async updateUser(id, name, userType) {
    return await UserManagementModel.updateUser(id, name, userType);
  }

  static async deleteUser(id) {
    return await UserManagementModel.deleteUser(id);
  }
}

export default UserManagementService;