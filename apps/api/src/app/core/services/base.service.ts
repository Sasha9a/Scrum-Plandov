import { Injectable } from "@nestjs/common";
import { FilterQuery, Model, ProjectionType, UpdateQuery } from "mongoose";

@Injectable()
export class BaseService<T> {

  public constructor(private readonly model: Model<T>) {
  }

  public async create<K>(entity: K): Promise<T> {
    const createEntity = new this.model(entity);
    return await createEntity.save() as unknown as T;
  }

  public async findAll(filter?: FilterQuery<T>, projection?: ProjectionType<T>): Promise<T[]> {
    return await this.model.find(filter, projection).exec();
  }

  public async findById(id: string, projection?: ProjectionType<T>): Promise<T> {
    return await this.model.findById(id, projection).exec();
  }

  public async update<K>(id: string, entity: UpdateQuery<K>): Promise<T> {
    return await this.model.findOneAndUpdate(<Partial<FilterQuery<T>>>{ _id: id }, { $set: entity }, { new: true }).exec() as unknown as T;
  }

  public async delete(id: string): Promise<T> {
    return await this.model.findByIdAndDelete(id).exec();
  }

}
