import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<Role> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this.roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }
    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles: Role[] = await this.roleRepository.find({
      where: { status: 'ACTIVE' },
    });
    return roles;
  }

  async create(role: Role): Promise<Role> {
    const savedRole = await this.roleRepository.save(role);
    return savedRole;
  }

  async update(id: number, role: Role): Promise<any> {
    const updateRole = await this.roleRepository.update(id, role);
    return updateRole;
  }

  async delete(id: number): Promise<void> {
    const roleExist = await this.roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });
    if (!roleExist) {
      throw new NotFoundException();
    }
    await this.roleRepository.update(id, { status: 'INACTIVE' });
  }
}
