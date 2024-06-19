import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  // const { user, error, isLoading } = useUser();
  const { user, isLoading, error } = useUser();
  // const { isAuthenticated } = useAuth();
  console.log("USER: ",user);
  // if (isAuthenticated) {
  //   console.log("HELLOOO");
  // }
  return (
    <>
      <Head>
        <title>Login or Signup</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen w-full bg-gray-800 text-center text-white">
        {!user && (
          <div>
            <Link
              href="/api/auth/login"
              className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Login
            </Link>
          </div>
        )}

        {user && (
          <div>
            <h1 className="my-6">Welcome <b>{user.nickname}</b></h1>
            <Link
              href="/display"
              className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Check out Recipes!!
            </Link>
            <Link
              href="/api/auth/logout"
              className="rounded-md bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Log out
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
