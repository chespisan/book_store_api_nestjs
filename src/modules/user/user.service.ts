import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async get(id: number): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this.userRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getAll(): Promise<User[]> {
    const users: User[] = await this.userRepository.find({
      where: { status: 'ACTIVE' },
    });
    return users;
  }

  async create(user: User): Promise<User> {
    const savedUser = await this.userRepository.save(user);
    return savedUser;
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
