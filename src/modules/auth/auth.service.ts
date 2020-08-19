import { RoleType } from './../role/roletype.enum';
import { IJwtPayload } from './jwt-payload.interface';
import { User } from './../user/user.entity';
import { SignupDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, email } = signupDto;
    const userExist = await this.authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExist) {
      throw new ConflictException('username or email already exist');
    }

    return this.authRepository.signup(signupDto);
  }

  async signin(signinDto: SigninDto) {
    const { username, password } = signinDto;

    const user: User = await this.authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user doest not exist');
    }

    // is exist user, compare password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name as RoleType),
    };
  }
}
