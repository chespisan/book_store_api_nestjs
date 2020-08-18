import { UserDto } from './dto/user.dto';
import { MapperService } from './../../shared/mapper.service';
import { UserRepository } from './user.repository';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mapperService: MapperService,
  ) {}

  async get(id: number): Promise<UserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this.userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return this.mapperService.map<User, UserDto>(user, new UserDto());
  }

  async getAll(): Promise<UserDto[]> {
    const users: User[] = await this.userRepository.find({
      where: { status: 'ACTIVE' },
    });
    return this.mapperService.mapCollection<User, UserDto>(
      users,
      new UserDto(),
    );
  }

  async create(user: User): Promise<UserDto> {
    const savedUser = await this.userRepository.save(user);
    return this.mapperService.map<User, UserDto>(savedUser, new UserDto());
  }

  async update(id: number, user: User): Promise<any> {
    const updateUser = await this.userRepository.update(id, user);
    return updateUser;
  }

  async delete(id: number): Promise<void> {
    const userExist = await this.userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!userExist) {
      throw new NotFoundException();
    }
    await this.userRepository.update(id, { status: 'INACTIVE' });
  }
}
