import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({ email: dto.email });
    if (userExist)
      throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create(dto);
    const user = await this.userRepository.save(newUser);

    delete user.password;

    return user;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne(id);

    if (!user)
      throw new NotFoundException('User does not exists or unauthorized');

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    console.log(dto);
    const user = await this.getById(id);
    const editedUser = Object.assign(user, dto);

    return await this.userRepository.save(editedUser);
  }

  async delete(id: string) {
    const user = await this.getById(id);

    return await this.userRepository.remove(user);
  }

  async findOne(data: Partial<Pick<User, 'id' | 'email'>>) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where(data)
      .addSelect('user.password')
      .getOne();
  }
}
