import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    activeSubscription: string | null;
    session: {
      expires: string;
      user:{
        name: string;
        image: string;
        email:string;
      }
    };
  }
}