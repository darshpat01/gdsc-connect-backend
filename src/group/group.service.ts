import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
//import group schema
import { Group, GroupDocument } from './schema/group.schema';
// import inject model
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import groupmodule

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}
  async create(createGroupDto: CreateGroupDto) {
    const group = new this.groupModel();
    group.name = createGroupDto.name;
    group.admins = [createGroupDto.admin];
    try {
      return await group.save();
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  //changeGroupName
  async changeGroupName(updateGroupDto: UpdateGroupDto) {
    const group = await this.groupModel.findById(updateGroupDto.groupId);
    if (!group) {
      throw new BadRequestException('Group not found');
    }
    group.name = updateGroupDto.name;
    await group.save();
    return group;
  }

  findAll() {
    return `This action returns all group`;
  }

  async findOne(groupId: string) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) throw new BadRequestException('No group found with this id');
    return group;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }

  async findGroupById(groupId: string) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) throw new BadRequestException('No group found with this id');
    return group;
  }
}
