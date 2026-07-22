import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsUUID, Min, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDto{
    @IsUUID('4', {message: 'O ID do produto deve ser um UUID válido.'})
    @IsNotEmpty({ message: 'O ID do produto é obrigatório.'})
    productId!: string;

    @IsInt({ message: 'A quantidade deve ser um número inteiro.'})
    @Min(1, { message: 'A quantidade deve ser maior que zero.'})
    quantity!: number;

}

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1, {message: 'O pedido deveconter pelo menos um item.'})
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];
}
