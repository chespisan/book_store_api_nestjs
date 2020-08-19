import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }
}
