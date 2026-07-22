import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição do produto é obrigatória.' })
  description!: string;

  @IsNumber()
  @Min(0.01, { message: 'O preço deve ser maior que zero.' })
  price!: number;

  @IsNumber()
  @Min(0, { message: 'O estoque não pode ser negativo.' })
  stock!: number;
}