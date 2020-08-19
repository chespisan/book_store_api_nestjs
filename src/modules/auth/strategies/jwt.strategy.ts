import { AuthRepository } from './../auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from './../jwt-payload.interface';
import { ConfigService } from './../../../config/config.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Configuration } from '../../../config/config.keys';
import { UnauthorizedException, Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
  ) {
    // methods extends passport strategy
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this.authRepository.findOne({
      where: { username, status: 'ACTIVE' },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
