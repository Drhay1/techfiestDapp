export class CreateCompanyDto {
  companyName?: string;
  country?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: number;
  logo?: string;
}

export class UpdateCompanyDto extends CreateCompanyDto {}
