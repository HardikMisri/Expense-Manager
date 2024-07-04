"use client";
import React, { useEffect, useState } from "react";

import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import CardInfo from "./_Navhelper/CardInfo";
import BarChartDashboard from "./_Navhelper/BarChartDashboard";
import BudgetItem from "./budgets/_budgethelper/BudgetItem";
import ExpenseListTable from "./expenses/_expenseComp/ExpenseListTable";

function Dashboard() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();
  const [expensesList,setExpensesList] =useState([]);
  useEffect(() => {
    user && getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    // Used to get Budget List
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };
  //Used to get all expenses
  const getAllExpenses=async()=>{
    const result = await db.select({
      id:Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets).rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId)).where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress)).orderBy(desc(Expenses.id));
    setExpensesList(result);
  }
  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl text-gray-500">Hi, {user?.fullName}</h2>
      <p>Here's what happenning with your money, Lets Manage your expense</p>
      <CardInfo budgetList={budgetList} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
        <div className="md:col-span-2">
          <BarChartDashboard
           budgetList= {budgetList}
          />
          <ExpenseListTable
           expensesList={expensesList}
           refreshData={()=>getBudgetList()}
          />
        </div>
        <div className="grid gap-3">
          <h2 className="font-bold text-lg">Latest Budgets!</h2>
          {budgetList.map((budget,index) =>(
            <BudgetItem budget={budget} key= {index}/>
          ))}
        </div>
      </div>
    
    </div>
  );
}

export default Dashboard;
