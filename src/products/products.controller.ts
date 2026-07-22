import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { AuthGuard } from '../auth/auth.guard';
  import { RolesGuard } from '../auth/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('vendedor')
    create(@Body() createProductDto: CreateProductDto) {
      return this.productsService.create(createProductDto);
    }
  
    @Get()
    findAll() {
      return this.productsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.productsService.findOne(id);
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('vendedor')
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
      return this.productsService.update(id, updateProductDto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('vendedor')
    remove(@Param('id') id: string) {
      return this.productsService.remove(id);
    }
  }