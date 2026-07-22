import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    return this.prisma.$transaction(async (transition) => {
      let orderTotal = 0;
      const itemsToCreate: Array<{ productId: string; quantity: number; price: number }> = [];

      for (const item of createOrderDto.items) {
        const product = await transition.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Produto com ID ${item.productId} não foi encontrado.`);
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stock}, Solicitado: ${item.quantity}`,
          );
        }

        const itemSubtotal = product.price * item.quantity;
        orderTotal += itemSubtotal;

        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price, 
        });

        
        await transition.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
            isSold: true,
          },
        });
      }

       
      return transition.order.create({
        data: {
          userId,
          total: orderTotal,
          items: {
            createMany: {
              data: itemsToCreate,
            },
          },
        },
        include: {
          items: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }

    return order;
  }
}