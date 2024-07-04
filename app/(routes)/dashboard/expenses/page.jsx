"use client";
import React, { useEffect, useState } from "react";

import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import ExpenseListTable from "./_expenseComp/ExpenseListTable";
import AddExpense from "./_expenseComp/AddExpense";

function page({params}) {
  const { user } = useUser();
 
  const [expensesList, setExpensesList] = useState([]);
 

  useEffect(() => {
    
    getAllExpenses();
  }, [user]);;

  
 

  const getAllExpenses=async()=>{
    const result = await db.select({
      id:Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets).rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId)).where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress)).orderBy(desc(Expenses.id));
    console.log(result);
    setExpensesList(result);
  }


  return(
    <div className="mt-4">
    
        <ExpenseListTable
              expensesList={expensesList}
              refreshData={()=>getAllExpenses()}
        />
       
      </div>
    
  ) 
}
export default page;
