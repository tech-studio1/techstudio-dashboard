"use server";

// import { signIn } from "@/services/auth";
import { revalidatePath } from "next/cache";

import Surreal from "surrealdb";
import { SignIn } from "./auth";

type LoginBodyType = {
  identifier: string;
  password: string;
};

export async function handlesignIn(data: LoginBodyType) {
  try {
    const response = await SignIn(data);
    revalidatePath("/");
    return response;
  } catch (err) {
    throw err;
  }
}

export async function createProduct(data: any) {
  const db = new Surreal();
  try {
    await db.connect("https://surrealdb.needglobal.com.bd/rpc", {
      auth: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJTVVJSRUFMIiwiaWF0IjoxNzMxMzU2OTMwLCJleHAiOjE3NjI4OTI5MzAsImF1ZCI6IiIsInN1YiI6IiIsImFjIjoibnRkZXZjZWxscm9vdCJ9.LSz4AOhSghjXYq-kVw9cv7qvPYhqyHQBOn4E-SV6wEpvrz0l618s-vczKawr8S5xMIUe_7lPPv0AF3E8SfaQPA",
    });
    await db.use({ namespace: "techstudio", database: "techstudio" });

    const [result]: any = await db.query(
      `CREATE raw_product CONTENT $content`,
      {
        content: data,
      }
    );

    return { result };
  } catch (err) {
    console.error(
      "Failed to connect to SurrealDB:",
      err instanceof Error ? err.message : String(err)
    );
    await db.close();
    throw err;
  }
}
