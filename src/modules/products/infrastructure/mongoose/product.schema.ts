import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<ProductSchemaClass>;

@Schema({ timestamps: true, collection: 'products' })
export class ProductSchemaClass {
  @Prop({ required: true })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ default: '' })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0, default: 0 })
  stock!: number;

  @Prop({ required: true })
  category!: string;

  @Prop({ required: true })
  ownerId!: string;

  @Prop({ default: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);
ProductSchema.index({ category: 1 });
ProductSchema.index({ ownerId: 1 });