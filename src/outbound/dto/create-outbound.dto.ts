import { IsString, IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OutboundDetailDto {
  @IsInt() productId: number;
  @IsInt() @Min(1) quantity: number;
  @IsInt() locationId: number;
  @IsInt() unitPrice: number;
}

export class CreateOutboundDto {
  @IsString() code: string;
  @IsString() customer: string;
  @IsInt() createdBy: number;
  @IsString() status?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutboundDetailDto)
  details: OutboundDetailDto[];
}
