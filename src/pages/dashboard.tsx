import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Layout } from "../components/layout/layout";
import { Content } from "../components/home/content";
import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react"
import LoadingComponent from "@/components/loading";

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


  if (loading || userType === null) return <LoadingComponent/> ;


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
