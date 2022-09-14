import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { hash } from 'bcrypt';
import { UserInterface } from 'src/auth/interfaces/user-interface.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    if (await this.userModel.findOne({ email: createUserDto.email }).exec()) {
      throw new BadRequestException('User already exists');
    }
    createUserDto.password = await hash(createUserDto.password, 10);
    const createdUser = new this.userModel(createUserDto);
    const user = await createdUser.save();
    return { ...user.toObject(), password: undefined };
  }

  async findAll(): Promise<any> {
    const allUsers = await this.userModel.find().exec();
    return allUsers;
  }

  async findOne(email: string, showPassword: boolean): Promise<UserInterface> {
    const user = await this.userModel
      .findOne({ email })
      .select(showPassword ? '+password' : '')
      .exec();

    const userObj = { ...user.toObject(), _id: user._id.toString() };
    if (!user)
      throw new BadRequestException('No user registered with this email');
    return userObj;
  }

  async addTags(email: string, tags: string[]): Promise<User> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          { email },
          { $addToSet: { tags: tags } },
          { new: true },
        )
        .exec();
      if (!user)
        throw new BadRequestException('No user registered with this email');
      return user.save();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findById(id: string): Promise<UserInterface> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new BadRequestException('No user found with this id');
    const userObj = { ...user.toObject(), _id: user._id.toString() };
    return userObj;
  }
}
