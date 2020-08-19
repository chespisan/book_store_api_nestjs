import { RoleService } from './role.service';
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    const role = await this.roleService.get(id);
    return role;
  }

  @Get()
  async getAllRole(): Promise<Role[]> {
    const roles = await this.roleService.getAll();
    return roles;
  }

  @Post()
  async createRole(@Body() role: Role): Promise<Role> {
    const createRole = await this.roleService.create(role);
    return createRole;
  }

  @Patch(':id')
  async updaterole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Role,
  ): Promise<Role> {
    const updateRole = await this.roleService.update(id, role);
    return updateRole;
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    await this.roleService.delete(id);
    return true;
  }
}
