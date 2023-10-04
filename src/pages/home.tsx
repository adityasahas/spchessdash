import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout/layout";
import { Content } from "../components/home/content";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react"

const AdminPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (!session) {
      window.location.href = "/login";
    }
  }, [session]);

  useEffect(() => {
    if (session) {  
      const fetchUserType = async () => {
        const email = (session.user as { email: string }).email;  
        if (email) { 
          const response = await fetch(
            `/api/db?email=${encodeURIComponent(email)}`
          );
          const data = await response.json();
          setUserType(data.userType);
        }
      };

      fetchUserType();
    }
  }, [session]);


  if (loading || userType === null) return <div>Loading...</div>;

  if (userType !== "admin")
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen text-center lowercase">
          <p>You do not have admin privileges.</p>
          <p>Contact Adi to get access (give him your email).</p>
          <Button
            className="mt-4"
            color="danger"
            onClick={() => signOut()}
            variant="light"
          >
            Log Out
          </Button>
        </div>
      </>
    );

  return (
    <Layout>
      <Content />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}

export default AdminPage;
