import { Controller, Get, Post, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }
  @Post()
  @Roles('ADMIN', 'STAFF')
  create(@Body() body: any) {
    console.log('Create products');
    return this.productService.create(body);
  }
  @Patch(':id')
  @Roles('ADMIN', 'STAFF')
  update(@Param('id') id: number, @Body() body: any) {
    return this.productService.update(id, body);
  }
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
