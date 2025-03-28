import User from '../models/user.model';
import { IUser, UserRole } from '../interfaces/user.interface';
import { JWT_SECRET, JWT_EXPIRE } from '../config/constants';

class AuthService {
  async registerUser(name: string, email: string, password: string, role: UserRole = UserRole.USER) {
    const user = await User.create({ name, email, password, role });
    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }

    const token = user.generateAuthToken();
    return { user, token };
  }

  async getAuthUser(userId: string) {
    return await User.findById(userId);
  }
}

export default new AuthService();