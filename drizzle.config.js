/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
  
    dbCredentials: {
      url:'postgresql://neondb_owner:yFxizv6VkWe4@ep-old-firefly-a5uqadv2.us-east-2.aws.neon.tech/Expense_tracker?sslmode=require',
    }
  }  ;