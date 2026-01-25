import { DatabaseService } from '@modules/database/database.service';
import {
  and,
  count,
  eq,
  InferSelectModel,
  isNull,
  SQL,
  Table,
} from 'drizzle-orm';
import { PgSelect, PgTable, TableConfig } from 'drizzle-orm/pg-core';

export type WhereClause<TSchema extends PgTable<TableConfig>> =
  | SQL<unknown>
  | SQL<unknown>[]
  | Partial<InferSelectModel<TSchema>>
  | undefined;

export type FindOptions<
  WithPagination extends boolean = false,
  Extra extends object = object,
> = { includeDeleted?: boolean } & Extra &
  (WithPagination extends true ? { offset?: number; limit?: number } : object);

type DataExcludedKeys = 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'deletedAt';

export abstract class AbstractRepository<
  TSchema extends PgTable<TableConfig>,
  TEntity extends InferSelectModel<TSchema> = InferSelectModel<TSchema>,
> {
  protected readonly MAX_DATA_PER_PAGE = 25;

  constructor(
    protected readonly databaseService: DatabaseService,
    public readonly schema: TSchema,
  ) {}

  public get db() {
    return this.databaseService.client;
  }

  async findOne(
    where: WhereClause<TSchema>,
    options: FindOptions = {},
  ): Promise<Nullable<TEntity>> {
    const { includeDeleted = false } = options;

    const conditions = this.buildConditions(where);
    if (!includeDeleted && this.schema['deletedAt'])
      conditions.push(isNull(this.schema['deletedAt']) as SQL<TSchema>);

    const query = this.db
      .select()
      .from(this.schema as Table)
      .where(and(...conditions))
      .limit(1);

    const result = await query;

    return (result[0] as TEntity) ?? null;
  }

  async findMany(
    where?: Nullable<WhereClause<TSchema>>,
    options: FindOptions<true> = {},
  ): Promise<TEntity[]> {
    const { offset, limit, includeDeleted = false } = options;

    let query = this.db
      .select()
      .from(this.schema as Table)
      .$dynamic();

    const conditions = this.buildConditions(where);
    if (!includeDeleted && this.schema['deletedAt'])
      conditions.push(isNull(this.schema['deletedAt']) as SQL<TSchema>);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await this.withPagination(query, offset, limit);

    return result as TEntity[];
  }

  async create(
    data: Omit<Partial<TEntity>, DataExcludedKeys>,
  ): Promise<TEntity> {
    const result = await this.db
      .insert(this.schema as Table)
      .values(data)
      .returning();

    return result[0] as TEntity;
  }

  async update(
    where: WhereClause<TSchema>,
    data: Omit<Partial<TEntity>, DataExcludedKeys>,
  ) {
    const _data: Partial<TEntity> = { ...data } as Partial<TEntity>;
    if (this.schema['updatedAt'])
      (_data as Partial<TEntity> & { updatedAt: Date }).updatedAt = new Date();

    const conditions = this.buildConditions(where);

    const result = await this.db
      .update(this.schema)
      .set(_data)
      .where(and(...conditions))
      .returning();

    return result;
  }

  async delete(
    where: WhereClause<TSchema>,
    options: { hardDelete?: boolean } = {},
  ) {
    const { hardDelete = false } = options;

    const conditions = this.buildConditions(where);

    if (hardDelete || !this.schema['deletedAt'])
      await this.db.delete(this.schema).where(and(...conditions));
    else {
      await this.db
        .update(this.schema as Table)
        .set({ deletedAt: new Date() })
        .where(and(...conditions));
    }
  }

  async count(
    where?: Nullable<WhereClause<TSchema>>,
    options: FindOptions<false> = {},
  ): Promise<number> {
    const { includeDeleted = false } = options;
    const query = this.db
      .select({ count: count() })
      .from(this.schema as Table)
      .$dynamic();

    const conditions = this.buildConditions(where);
    if (!includeDeleted && this.schema['deletedAt'])
      conditions.push(isNull(this.schema['deletedAt']) as SQL<TSchema>);

    const result = await query.where(and(...conditions));

    return result[0].count ?? 0;
  }

  protected withPagination<T extends PgSelect>(
    qb: T,
    offset: number = 0,
    limit?: number,
  ): T {
    let query = qb.offset(offset);

    if (limit && limit > 0) query = query.limit(limit);

    return query;
  }

  protected buildConditions(
    where: Nullish<WhereClause<TSchema>>,
  ): SQL<unknown>[] {
    const conditions: SQL<unknown>[] = [];

    if (!where) return conditions;

    // Si c'est un tableau de SQL
    if (Array.isArray(where)) {
      conditions.push(...where);
    }
    // Si c'est déjà un SQL
    else if (where instanceof SQL) {
      conditions.push(where);
    }
    // Si c'est un objet simple (Partial<TEntity>)
    else if (typeof where === 'object') {
      for (const [key, value] of Object.entries(where)) {
        if (value !== undefined && key in this.schema) {
          conditions.push(eq(this.schema[key], value));
        }
      }
    }

    return conditions;
  }

  // protected buildConditions(
  //   where: Nullish<WhereClause<TSchema>>,
  // ): SQL<TSchema>[] {
  //   const conditions: SQL<TSchema>[] = [];
  //   if (where)
  //     // conditions.push(
  //     //   ...Object.entries(where).map(([key, value]) => {
  //     //     if (
  //     //       typeof value === 'object' &&
  //     //       value !== null &&
  //     //       ('toSQL' in value || 'getSQL' in value)
  //     //     ) {
  //     //       return value as SQL | SQLWrapper;
  //     //     }
  //     //     return eq(this.schema[key], value);
  //     //   }),
  //     // );
  //   return conditions;
  // }

  getPaginationParams(query: { page?: number; limit?: number }): {
    limit: number;
    offset: number;
  } {
    const limit = Math.min(
      query.limit ?? this.MAX_DATA_PER_PAGE,
      this.MAX_DATA_PER_PAGE,
    );
    const offset = ((query.page ?? 1) - 1) * limit;

    return { limit, offset };
  }
}
