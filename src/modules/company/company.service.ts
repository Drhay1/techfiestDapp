import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/create-company.dto';
import { CompanyProps } from './interface/company.interface';
import { Company } from '../company/schemas/company.schema';
import { User } from '../user/schemas/user.schema';
import { UserProps } from '../user/interfaces/user.interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private userService: UserService,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: UserProps,
  ): Promise<CompanyProps> {
    const createdCompany = await new this.companyModel({
      ...createCompanyDto,
      user: user._id,
    }).save();

    const up = this.userService.updateUserProflie(
      { company: createdCompany._id },
      user,
    );

    return createdCompany;
  }

  async getCompanyByUser(user: UserProps): Promise<CompanyProps> {
    const company = await this.companyModel.findOne<CompanyProps>({
      user: user._id,
    });

    return company;
  }

  async updateCompany(_id: string, body: UpdateCompanyDto): Promise<any> {
    const updated = await this.companyModel.updateOne(
      { _id },
      { logo: body.logo },
    );

    return updated;
  }
}
