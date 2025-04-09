import { drizzle } from 'drizzle-orm/libsql';

import * as authSchema from './schema/auth';
import * as topicSchema from './schema/topics';

export const db = drizzle(process.env.DB_FILE_NAME!, {
  schema: {
    ...authSchema,
    ...topicSchema
  },
});
