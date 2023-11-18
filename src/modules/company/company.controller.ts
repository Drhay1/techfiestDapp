import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { Role } from '../user/interfaces/user.interfaces';
import { UpdateCompanyDto } from './dto/create-company.dto';
import HttpStatusCodes from 'src/configurations/HttpStatusCodes';
import { Roles } from '@/middleware/authorization/roles.decorator';
import { RolesGuard } from '@/middleware/authorization/guards/roles.guard';
import { Controller, Body, Put, UseGuards, Req, Res } from '@nestjs/common';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(VerifyLogin)
  @Roles(Role.Client, Role.Admin)
  @UseGuards(RolesGuard)
  @Put('')
  async updatedCompanyInfo(
    @Body() body: UpdateCompanyDto,
    @Req() req: any,
    @Res() res: any,
  ) {
    const user = req.user;
    const company: any = await this.companyService.getCompanyByUser(user);

    try {
      if (company) {
        await this.companyService.updateCompany(company._id, body);
        res.status(HttpStatusCodes.OK).send({ msg: 'Info updated' });
      } else {
        await this.companyService.create(body, user);
        return res.status(200).send({ created: true });
      }
    } catch (err) {
      //TODO: notify admin with the error message
      console.log(err);
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .send({ msg: 'Something went wrong' });
    }
  }
}
