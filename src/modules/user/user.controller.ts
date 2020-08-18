import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDto> {
    const user = await this.userService.get(id);
    return user;
  }

  @Get()
  async getAllUser(): Promise<UserDto[]> {
    const users = await this.userService.getAll();
    return users;
  }

  @Post()
  async createUser(@Body() user: User): Promise<UserDto> {
    const createUser = await this.userService.create(user);
    return createUser;
  }

  @Patch(':id')
  async updateuser(
    @Param('id') id: number,
    @Body() user: User,
  ): Promise<UserDto> {
    const updateUser = await this.userService.update(id, user);
    return updateUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    await this.userService.delete(id);
    return true;
  }
}
