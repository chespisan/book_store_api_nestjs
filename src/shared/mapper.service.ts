import { UserDto } from './../modules/user/dto/user.dto';
import { User } from './../modules/user/user.entity';
import { Injectable } from '@nestjs/common';
import { TypeMapper } from 'ts-mapper';

@Injectable()
export class MapperService extends TypeMapper {
  constructor() {
    super(); // llamamos al contructor de TypeMapper
    this.config();
  }

  private config() {
    this.createMap<User, UserDto>()
      .map(
        entity => entity.id,
        dto => dto.id,
      )
      .map(
        entity => entity.username,
        dto => dto.username,
      )
      .map(
        entity => entity.email,
        dto => dto.email,
      )
      .map(
        entity => entity.details,
        dto => dto.details,
      )
      .map(
        entity => entity.roles,
        dto => dto.roles,
      );
  }
}
