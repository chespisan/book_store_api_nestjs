import { UserDetails } from './../user/user.details.entity';
import { RoleType } from './../role/roletype.enum';
import { Role } from './../role/role.entity';
import { RoleRepository } from './../role/role.repository';
import { SignupDto } from './dto/signup.dto';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { User } from './../user/user.entity';
import { getSalt, hash } from 'bcryptjs';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signup: SignupDto) {
    // destruc signup
    const { username, email, password } = signup;

    // create and set instance User
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    // connection roleRepository
    const roleRepository: RoleRepository = await getConnection().getRepository(
      Role,
    );

    // set default role => GENERAL
    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    // create and set instance UserDetails
    const details = new UserDetails();
    user.details = details;

    // generate salt and hash to password
    const salt = await getSalt('10');
    user.password = await hash(password, salt);

    await user.save();
  }
}
