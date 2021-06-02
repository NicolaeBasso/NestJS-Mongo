import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });

    const result = await newProduct.save();
    console.log(result);
    return result.id as string;
  }

  async getProducts() {
    const products = await this.productModel.find().exec();
    return products.map((product) => {
      return {
        id: product.id,
        description: product.description,
        price: product.price,
        title: product.title,
      };
    });
  }

  async getSingleProduct(productId: string) {
    let product = null;

    try {
      product = await this.findProduct(productId);
    } catch (error) {
      throw new NotFoundException('Product not found.');
    }

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    // return product;
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);

    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }

    updatedProduct.save();
  }

  async deleteProduct(prodId: string) {
    const result = await this.productModel.deleteOne({ _id: prodId }).exec();

    if (result.n === 0) {
      throw new NotFoundException('Product not found');
    }
    console.log(result);
  }

  private async findProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    // return [product, productIndex];
    return product;
  }
}
