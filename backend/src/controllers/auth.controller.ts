import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '../services/auth.service';
import { SUCCESS } from '../config/constants';

class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;
      const user = await AuthService.registerUser(name, email, password, role);
    
      const token = user.generateAuthToken();
    
      res.status(StatusCodes.CREATED).json({
        status: SUCCESS,
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.loginUser(email, password);
    
      res.status(StatusCodes.OK).json({
        status: SUCCESS,
        data: { user, token },
      });
    } catch (error) {
      next(error);
    }
  }

  getMe = async (req: Request & { user: { id: string, role: string } }, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await AuthService.getAuthUser(req.user.id);
    
      res.status(StatusCodes.OK).json({
        status: SUCCESS,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();